import type { Contracts, Strategy } from '../core/contracts'

export type { Strategy } from '../core/contracts'

/**
 * Build a strategy registry.
 *
 * The engine looks up `strategy.id` to dispatch uploads, so duplicate
 * registration is almost always a wiring bug (two libraries registering
 * the same id, or a plugin shadowing a core strategy). The dev-only
 * warn surfaces this without breaking valid hot-reload reuse;
 * production routes through `onOverwrite` if the consumer wires it.
 *
 * @returns Fresh empty registry implementing {@link Strategy.IRegistry}.
 * @template M Intent map.
 * @template C Cursor map keyed by strategy id.
 * @template P Purpose union; defaults to `string`.
 * @template R Backend result shape; defaults to {@link Contracts.IResultBase}.
 * @example
 * ```ts
 * import {
 *   createStrategyRegistry,
 *   PostStrategy,
 *   multipartStrategy,
 * } from '@gentleduck/duck-upload'
 *
 * const strategies = createStrategyRegistry<MyIntents, MyCursors>()
 * strategies.set(PostStrategy<MyIntents, MyCursors>())
 * strategies.set(multipartStrategy<MyIntents, MyCursors>())
 * strategies.onOverwrite = (id) => telemetry.warn('strategy overwrite', { id })
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createStrategyRegistry<
  M extends Contracts.IntentMap,
  C extends Contracts.CursorMap<M>,
  P extends string = string,
  R extends Contracts.IResultBase = Contracts.IResultBase,
>(): Strategy.IRegistry<M, C, P, R> {
  // Generic mapped types (`Partial<{ [K in keyof M & string]: ... }>`) are not
  // writable in TS, so the internal storage is a plain Map and casts narrow
  // back to the per-key shape at the read boundary.
  type AnyStrategy = Strategy.IStrategy<M, C, P, R, keyof M & string>
  const map = new Map<string, AnyStrategy>()
  const registry: Strategy.IRegistry<M, C, P, R> = {
    get<K extends keyof M & string>(id: K) {
      return map.get(id) as Strategy.IStrategy<M, C, P, R, K> | undefined
    },
    has(id): id is keyof M & string {
      return map.has(id)
    },
    set<K extends keyof M & string>(strategy: Strategy.IStrategy<M, C, P, R, K>) {
      // Runtime guard against a malformed strategy (id missing or wrong
      // type). The TS generic alone is not enough: a `(strategy as any)`
      // cast on the caller side can sneak in a bad shape.
      if (typeof strategy.id !== 'string' || strategy.id.length === 0) {
        throw new TypeError(
          `[UploadEngine] strategies.set received a strategy with a missing or empty id (got ${typeof strategy.id})`,
        )
      }
      const existing = map.get(strategy.id)
      const asAny = strategy as unknown as AnyStrategy
      if (existing && existing !== asAny) {
        // Overwrite fires the production hook before the dev-warn fallback.
        // A silent prod overwrite on hot-reload used to lose references;
        // the hook lets consumers route it to telemetry.
        if (registry.onOverwrite) {
          try {
            registry.onOverwrite(strategy.id)
          } catch (hookErr) {
            console.error('[UploadEngine] strategies.onOverwrite hook threw:', hookErr)
          }
        } else if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[UploadEngine] Strategy "${String(strategy.id)}" already registered; overwriting. ` +
              'Two strategies sharing an id usually means duplicate setup.',
          )
        }
      }
      map.set(strategy.id, asAny)
    },
    delete<K extends keyof M & string>(id: K, reason?: string) {
      const existed = map.delete(id)
      if (existed && registry.onDelete) {
        try {
          registry.onDelete(id, reason)
        } catch (hookErr) {
          console.error('[UploadEngine] strategies.onDelete hook threw:', hookErr)
        }
      }
      return existed
    },
    entries() {
      return Array.from(map.values())
    },
    iterate() {
      // Snapshot iterator: captures the value array at call time so
      // mid-iteration `set`/`delete` does not affect the yield. The
      // alternative -- yielding the live Map iterator -- exposes stale
      // refs to consumers that mutate during walk.
      const snapshot = Array.from(map.values())
      let i = 0
      const iterator: IterableIterator<AnyStrategy> = {
        next(): IteratorResult<AnyStrategy> {
          if (i >= snapshot.length) {
            return { value: undefined as unknown as AnyStrategy, done: true }
          }
          return { value: snapshot[i++], done: false }
        },
        [Symbol.iterator]() {
          return iterator
        },
      }
      return iterator
    },
    get size() {
      return map.size
    },
  }
  return registry
}
