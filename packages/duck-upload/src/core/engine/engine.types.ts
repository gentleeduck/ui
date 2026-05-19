import type { Contracts } from '../contracts'

/**
 * Engine-level type surface.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Engine {
  // -------------------- Progress --------------------

  /**
   * Upload progress snapshot with `pct` clamped to 0..100.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IUploadProgress {
    /** Bytes uploaded so far. */
    uploadedBytes: number
    /** Total bytes to upload. */
    totalBytes: number
    /** Percent complete (0..100). */
    pct: number
  }

  // -------------------- Outcome --------------------

  /**
   * How a `completed` item finished.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type CompletionKind = 'upload' | 'dedupe'

  /**
   * Terminal outcome returned by `Store.IUploadStore.waitFor`.
   *
   * @template R Result type carried on successful completion.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Outcome<R extends Contracts.IResultBase> =
    | { localId: string; status: 'completed'; completedBy: CompletionKind; result: R }
    | { localId: string; status: 'error'; error: Contracts.Error }
    | { localId: string; status: 'canceled' }
    | {
        localId: string
        status: 'missing'
        /**
         * Why the id is missing. Required so consumers exhaustively
         * handle every cause via switch.
         * - `'removed'`: explicit `dispatch({ type: 'remove' })`.
         * - `'evicted'`: cleanup pass (`maxItems` / `completedItemTTL`).
         * - `'never-existed'`: the id was never registered in this store.
         * - `'destroyed'`: `store.destroy()` ran while the wait was pending.
         */
        reason: 'removed' | 'evicted' | 'never-existed' | 'destroyed'
      }

  // -------------------- Commands --------------------

  /**
   * Public commands accepted by `store.dispatch`.
   *
   * @template P Purpose discriminator string.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Command<P extends string> =
    | { type: 'addFiles'; files: File[]; purpose: P }
    | { type: 'start'; localId: string }
    | { type: 'startAll'; purpose?: P }
    | { type: 'pause'; localId: string }
    | { type: 'pauseAll'; purpose?: P }
    | { type: 'resume'; localId: string }
    | { type: 'cancel'; localId: string }
    | { type: 'cancelAll'; purpose?: P }
    | { type: 'retry'; localId: string }
    | { type: 'rebind'; localId: string; file: File }
    | { type: 'remove'; localId: string }

  // -------------------- Phases / Items --------------------

  /**
   * Every upload phase; the `phase` discriminator of {@link Engine.Item}.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Phase =
    | 'validating'
    | 'creating_intent'
    | 'ready'
    | 'queued'
    | 'uploading'
    | 'paused'
    | 'completing'
    | 'completed'
    | 'error'
    | 'canceled'

  /**
   * Enum-style const map of every {@link Phase} value.
   *
   * Reading `Phases.completing` matches the string literal at compile time
   * AND gives consumers a single import point instead of N magic-string
   * checks. Use whichever style fits the call site.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export const Phases = {
    validating: 'validating',
    creating_intent: 'creating_intent',
    ready: 'ready',
    queued: 'queued',
    uploading: 'uploading',
    paused: 'paused',
    completing: 'completing',
    completed: 'completed',
    error: 'error',
    canceled: 'canceled',
  } as const satisfies Record<Phase, Phase>

  /**
   * Discriminated union on `phase` describing a single upload's state.
   *
   * @template M Intent map keyed by strategy id.
   * @template C Cursor map keyed by strategy id.
   * @template P Purpose discriminator string.
   * @template R Backend result payload.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type Item<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > =
    | {
        phase: 'validating'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        createdAt: number
      }
    | {
        phase: 'creating_intent'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        attempt: number
        createdAt: number
      }
    | {
        phase: 'ready'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        intent: Contracts.AnyIntent<M>
        createdAt: number
        cursor?: Contracts.AnyCursor<C>
        progress?: IUploadProgress
        attempt?: number
      }
    | {
        phase: 'queued'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        intent: Contracts.AnyIntent<M>
        requestedAt: number
        createdAt: number
        cursor?: Contracts.AnyCursor<C>
        progress?: IUploadProgress
        attempt?: number
      }
    | {
        phase: 'uploading'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        intent: Contracts.AnyIntent<M>
        startedAt: number
        progress: IUploadProgress
        createdAt: number
        cursor?: Contracts.AnyCursor<C>
        attempt?: number
      }
    | {
        phase: 'paused'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        intent: Contracts.AnyIntent<M>
        cursor: Contracts.AnyCursor<C>
        progress: IUploadProgress
        pausedAt: number
        createdAt: number
        file?: File
        attempt?: number
      }
    | {
        phase: 'completing'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        file: File
        intent: Contracts.AnyIntent<M>
        progress: IUploadProgress
        completingAt: number
        createdAt: number
        attempt?: number
      }
    | {
        phase: 'completed'
        localId: string
        file?: File
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        intent?: Contracts.AnyIntent<M>
        completedBy: CompletionKind
        result: R
        completedAt: number
        createdAt: number
        attempt?: number
      }
    | {
        phase: 'error'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        error: Contracts.Error
        retryable: boolean
        attempt: number
        failedAt: number
        createdAt: number
        file?: File
        intent?: Contracts.AnyIntent<M>
        cursor?: Contracts.AnyCursor<C>
        progress?: IUploadProgress
      }
    | {
        phase: 'canceled'
        localId: string
        purpose: P
        fingerprint: Contracts.IFileFingerprint
        canceledAt: number
        createdAt: number
        file?: File
        intent?: Contracts.AnyIntent<M>
        cursor?: Contracts.AnyCursor<C>
        progress?: IUploadProgress
        attempt?: number
      }

  // -------------------- Internal events --------------------

  /**
   * Events emitted by effects and consumed by the reducer. Distinct from the
   * public event surface -- these drive state transitions.
   *
   * @template M Intent map keyed by strategy id.
   * @template C Cursor map keyed by strategy id.
   * @template P Purpose discriminator string.
   * @template R Backend result payload.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type InternalEvent<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > =
    | {
        type: 'files.added'
        items: Array<{
          localId: string
          purpose: P
          file: File
          fingerprint: Contracts.IFileFingerprint
          createdAt: number
        }>
      }
    | { type: 'fingerprint.updated'; localId: string; fingerprint: Contracts.IFileFingerprint }
    | { type: 'validation.ok'; localId: string }
    | { type: 'validation.failed'; localId: string; reason: Contracts.RejectReason }
    | { type: 'intent.ok'; localId: string; intent: Contracts.AnyIntent<M> }
    | { type: 'intent.failed'; localId: string; error: Contracts.Error; retryable: boolean }
    | { type: 'upload.begin'; localId: string; startedAt: number }
    | { type: 'upload.progress'; localId: string; uploadedBytes: number; totalBytes: number }
    | { type: 'cursor.updated'; localId: string; cursor: Contracts.AnyCursor<C> }
    | { type: 'upload.ok'; localId: string }
    | { type: 'upload.failed'; localId: string; error: Contracts.Error; retryable: boolean }
    | { type: 'dedupe.ok'; localId: string; result: R }
    | { type: 'complete.ok'; localId: string; result: R }
    | { type: 'complete.failed'; localId: string; error: Contracts.Error; retryable: boolean }
    | { type: 'paused'; localId: string; cursor: Contracts.AnyCursor<C>; pausedAt: number }
    | { type: 'canceled'; localId: string; canceledAt: number }

  // -------------------- Public event map --------------------

  /**
   * Public event map emitted to consumers via `store.on(type, cb)`.
   *
   * @template M Intent map keyed by strategy id.
   * @template C Cursor map keyed by strategy id.
   * @template P Purpose discriminator string.
   * @template R Backend result payload.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type EventMap<
    M extends Contracts.IntentMap,
    C extends Contracts.CursorMap<M>,
    P extends string,
    R extends Contracts.IResultBase = Contracts.IResultBase,
  > = {
    'file.added': { localId: string; purpose: P; file: File; fingerprint: Contracts.IFileFingerprint }
    'file.rejected': { file: File; reason: Contracts.RejectReason }

    'validation.ok': { localId: string }
    'validation.failed': { localId: string; reason: Contracts.RejectReason }

    'intent.creating': { localId: string }
    'intent.created': { localId: string; intent: M[keyof M] }
    'intent.failed': { localId: string; error: Contracts.Error; retryable: boolean }

    'upload.queued': { localId: string }
    'upload.resumed': { localId: string }
    'upload.started': { localId: string }
    'upload.progress': { localId: string; pct: number; uploadedBytes: number; totalBytes: number }
    'upload.cursor': { localId: string; cursor: Contracts.AnyCursor<C> }
    'upload.paused': { localId: string; cursor: Contracts.AnyCursor<C> }
    'upload.canceled': { localId: string }

    'upload.completing': { localId: string }
    'upload.completed': { localId: string; result: R; completedBy: CompletionKind }

    'upload.error': { localId: string; error: Contracts.Error; retryable: boolean }

    /**
     * Emitted whenever an item leaves state. `reason: 'user'` for an
     * explicit `dispatch({ type: 'remove' })`; `reason: 'cleanup'` for
     * an automatic eviction by `completedItemTTL` / `maxItems`. Lets
     * consumers (waitFor, UI listeners, telemetry) react without polling
     * the snapshot.
     */
    'upload.removed': { localId: string; reason: 'user' | 'cleanup' }

    'rebind.ok': { localId: string }
    'rebind.failed': { localId: string; reason: RebindReason }
  }

  /**
   * Why a `rebind` command did not bind a file.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export type RebindReason =
    | { code: 'no_item' }
    | { code: 'wrong_phase'; phase: string }
    | { code: 'already_bound' }
    | { code: 'fingerprint_mismatch'; expected: Contracts.IFileFingerprint; got: Contracts.IFileFingerprint }
}
