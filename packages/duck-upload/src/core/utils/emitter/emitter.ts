import type { Emitter } from './emitter.types'

/**
 * Listener-throw callback. Re-exported alias for the canonical
 * {@link Emitter.ErrorHandler} type. Kept for backwards compatibility
 * with R30 import paths; prefer `Emitter.ErrorHandler` in new code.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export type EmitterErrorHandler = Emitter.ErrorHandler

/**
 * Listener registry, bucketed by event type.
 *
 * @template E Event map.
 */
type ListenerMap<E extends Record<string, unknown>> = Partial<{
  [K in keyof E & string]: Set<(payload: E[K]) => void>
}>

/**
 * Soft cap on nested `emit` depth. A listener that synchronously dispatches a
 * command which fires another emit is legal -- but unbounded re-entry usually
 * means a feedback loop. The cap surfaces it in dev without aborting.
 */
const MAX_EMIT_DEPTH = 50

/**
 * Build a typed event emitter with listener-throw isolation.
 *
 * Listeners added or removed during an `emit` see a stable snapshot of the
 * listener set; the mutation lands on the *next* emission.
 *
 * @param onError Optional error sink. Receives `(type, error, listener)` on
 *   every listener throw. Falls back to dev-only `console.error` when omitted.
 * @returns Configured emitter exposing `on` / `off` / `emit`.
 * @template E Event map (`Record<eventName, payloadType>`).
 * @example
 * ```ts
 * type Events = { 'file.added': { id: string }, 'upload.progress': { pct: number } }
 * const emitter = createTypedEmitter<Events>()
 * emitter.on('file.added', (p) => console.log(p.id))
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function createTypedEmitter<E extends Record<string, unknown>>(
  onError?: EmitterErrorHandler,
): Emitter.ITypedEmitter<E> {
  const listeners: ListenerMap<E> = {}
  // Memoized iteration snapshots per event type. Invalidated on `on`/`off`.
  // Multi-listener `emit` would otherwise allocate a fresh array every call;
  // for progress streams that adds up to one Set + spread per progress tick.
  const snapshots = new Map<string, ReadonlyArray<(payload: unknown) => void>>()
  let emitDepth = 0
  let warnedDepth = false

  const invalidate = (type: string) => {
    if (snapshots.size > 0) snapshots.delete(type)
  }

  return {
    on<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): () => void {
      let set = listeners[type]
      if (!set) {
        set = new Set<(payload: E[K]) => void>()
        listeners[type] = set
      }
      set.add(cb)
      invalidate(type)

      return () => {
        const typeListeners = listeners[type]
        if (!typeListeners) return
        typeListeners.delete(cb)
        invalidate(type)
        if (typeListeners.size === 0) delete listeners[type]
      }
    },

    off<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): void {
      const typeListeners = listeners[type]
      if (!typeListeners) return
      typeListeners.delete(cb)
      invalidate(type)
      if (typeListeners.size === 0) delete listeners[type]
    },

    emit<K extends keyof E & string>(type: K, payload: E[K]): void {
      const typeListeners = listeners[type]
      if (!typeListeners || typeListeners.size === 0) return

      const dispatch = (cb: (payload: E[K]) => void) => {
        try {
          cb(payload)
        } catch (err) {
          if (onError) {
            try {
              onError(type, err, cb as (...args: unknown[]) => void)
            } catch {}
            return
          }
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.error(`[UploadEngine] Error in event listener for "${type}":`, err)
          }
        }
      }

      emitDepth++
      try {
        if (emitDepth > MAX_EMIT_DEPTH && !warnedDepth && process.env.NODE_ENV !== 'production') {
          warnedDepth = true
          console.warn(
            `[UploadEngine] emit depth exceeded ${MAX_EMIT_DEPTH} for "${type}". ` +
              'A listener is likely dispatching a command that re-emits, forming a feedback loop. ' +
              'Defer the dispatch with `queueMicrotask` to break the chain.',
          )
        }

        // Size-1 fast path: skip the snapshot allocation when only one
        // listener is attached. Hot path under busy progress streams where
        // most subscribers attach exactly one listener per event type.
        if (typeListeners.size === 1) {
          const [only] = typeListeners
          dispatch(only)
          return
        }

        // Multi-listener path: reuse the memoized snapshot so `on()`/`off()`
        // from inside a listener doesn't reshape iteration mid-flight AND
        // back-to-back emits don't re-allocate the array.
        let snapshot = snapshots.get(type) as ReadonlyArray<(payload: E[K]) => void> | undefined
        if (!snapshot) {
          snapshot = Array.from(typeListeners) as ReadonlyArray<(payload: E[K]) => void>
          snapshots.set(type, snapshot as ReadonlyArray<(payload: unknown) => void>)
        }
        for (const cb of snapshot) dispatch(cb)
      } finally {
        emitDepth--
        if (emitDepth === 0) warnedDepth = false
      }
    },
  }
}
