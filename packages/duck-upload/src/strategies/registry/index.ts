/**
 * Strategy registry helpers.
 *
 * Core strategy types live in `core/contracts/strategy.types.ts`.
 */

import type { CursorMap, IntentMap, StrategyRegistry, UploadResultBase, UploadStrategy } from '../../core/contracts'

export type { StrategyCtx, StrategyRegistry, UploadStrategy } from '../../core/contracts'

export function createStrategyRegistry<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string = string,
  R extends UploadResultBase = UploadResultBase,
>(): StrategyRegistry<M, C, P, R> {
  const map: Partial<{ [K in keyof M & string]: UploadStrategy<M, C, P, R, K> }> = {}

  return {
    get(id) {
      return map[id]
    },
    has(id): id is keyof M & string {
      return Object.hasOwn(map, id)
    },
    set(strategy) {
      map[strategy.id] = strategy
    },
  }
}
