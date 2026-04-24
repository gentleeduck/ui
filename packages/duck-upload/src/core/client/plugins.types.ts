import type { CursorMap, IntentMap, UploadResultBase } from '../contracts'
import type { InternalEvent } from '../engine/internal-events.types'
import type { UploadStore } from '../engine/store'

/**
 * Optional hooks for observing internal behavior.
 *
 * Use these for diagnostics, analytics, logging, or devtools.
 */
export type UploadHooks<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = {
  /**
   * Called after internal events are processed (depending on your runtime wiring).
   * Prefer this over subscribing to public events if you need full fidelity.
   */
  onInternalEvent?: (
    event: InternalEvent<M, C, P, R>,
    state: import('../engine/reducer').UploadState<M, C, P, R>,
  ) => void
}

/**
 * Store plugins.
 *
 * Plugins can subscribe to store events and dispatch commands.
 * They should not reach into internal state mutably.
 */
export type UploadPlugin<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = {
  /** Plugin name (for debugging). */
  name: string

  /**
   * Setup callback called once when the store is created.
   * The plugin can register event listeners and drive behavior.
   */
  setup: (ctx: Pick<UploadStore<M, C, P, R>, 'on' | 'dispatch' | 'getSnapshot'>) => void
}
