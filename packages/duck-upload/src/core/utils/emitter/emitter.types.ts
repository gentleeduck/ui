/**
 * Minimal typed event emitter interface.
 *
 * Use this to expose strongly-typed events from your store.
 *
 * @typeParam E - Event map (`eventName -> payload`).
 */
export type TypedEmitter<E extends Record<string, unknown>> = {
  /**
   * Subscribe to an event.
   * @returns Unsubscribe function.
   */
  on<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): () => void

  /**
   * Unsubscribe from an event.
   * @returns Unsubscribe function.
   */
  off<K extends keyof E & string>(type: K, cb: (payload: E[K]) => void): () => void

  /** Emit an event to all listeners. */
  emit<K extends keyof E & string>(type: K, payload: E[K]): void
}
