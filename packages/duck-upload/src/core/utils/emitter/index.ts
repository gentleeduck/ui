import type { TypedEmitter } from './emitter.types'

export type { TypedEmitter } from './emitter.types'

/**
 * Creates a lightweight, typed event emitter.
 * We use this instead of `EventEmitter` or `EventTarget` to ensure:
 * 1. Strict typing of event payloads (via generic E)
 * 2. No dependency on Node.js built-ins (browser compatible)
 * 3. Exception safety (user listeners don't crash the loop)
 *
 * @template E - Event map type (Record<eventName, payloadType>)
 *
 * @returns {TypedEmitter<E>} Typed emitter instance
 *
 * @example
 * ```ts
 * type Events = { 'file.added': { id: string }, 'upload.progress': { pct: number } }
 * const emitter = createTypedEmitter<Events>()
 * emitter.on('file.added', (payload) => console.log(payload.id))
 * ```
 */
type ListenerMap<E extends Record<string, unknown>> = Partial<{
  [K in keyof E & string]: Set<(payload: E[K]) => void>
}>

export function createTypedEmitter<E extends Record<string, unknown>>(): TypedEmitter<E> {
  const listeners: ListenerMap<E> = {}

  return {
    on<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): () => void {
      // Create listener set for this event type if it doesn't exist
      let set = listeners[type]
      if (!set) {
        set = new Set<(payload: E[K]) => void>()
        listeners[type] = set
      }
      set.add(cb)

      // Return unsubscribe function
      return () => {
        const typeListeners = listeners[type]
        if (!typeListeners) return
        typeListeners.delete(cb)
        if (typeListeners.size === 0) delete listeners[type]
      }
    },

    off<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): () => void {
      const typeListeners = listeners[type]
      if (!typeListeners) return () => {}
      typeListeners.delete(cb)
      if (typeListeners.size === 0) delete listeners[type]
      return () => {}
    },

    emit<K extends keyof E & string>(type: K, payload: E[K]): void {
      const typeListeners = listeners[type]
      if (!typeListeners) return

      typeListeners.forEach((cb) => {
        try {
          cb(payload)
        } catch (err) {
          // Do not crash upload engine due to user callbacks
          // In production, this should be sent to error tracking service
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.error(`[UploadEngine] Error in event listener for "${type}":`, err)
          }
        }
      })
    },
  }
}
