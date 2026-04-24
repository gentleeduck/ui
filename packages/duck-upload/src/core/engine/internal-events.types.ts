import type {
  AnyCursor,
  AnyIntent,
  CursorMap,
  FileFingerprint,
  IntentMap,
  RejectReason,
  UploadError,
  UploadResultBase,
} from '../contracts'
import type { UploadCompletionKind } from './outcome.types'
import type { UploadProgress } from './progress.types'

/**
 * Internal events emitted by effects and consumed by the reducer.
 *
 * These are not the same as public events. They are designed for correctness and state transitions.
 *
 * @typeParam M - Intent map
 * @typeParam C - Cursor map
 */
export type InternalEvent<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> =
  | {
      type: 'files.added'
      items: Array<{ localId: string; purpose: P; file: File; fingerprint: FileFingerprint; createdAt: number }>
    }
  | { type: 'fingerprint.updated'; localId: string; fingerprint: FileFingerprint }
  | { type: 'validation.ok'; localId: string }
  | { type: 'validation.failed'; localId: string; reason: RejectReason }
  | { type: 'intent.ok'; localId: string; intent: AnyIntent<M> }
  | { type: 'intent.failed'; localId: string; error: UploadError; retryable: boolean }
  | { type: 'upload.begin'; localId: string; startedAt: number }
  | { type: 'upload.progress'; localId: string; uploadedBytes: number; totalBytes: number }
  | { type: 'cursor.updated'; localId: string; cursor: AnyCursor<C> }
  | { type: 'upload.ok'; localId: string }
  | { type: 'upload.failed'; localId: string; error: UploadError; retryable: boolean }
  | { type: 'dedupe.ok'; localId: string; result: R }
  | { type: 'complete.ok'; localId: string; result: R }
  | { type: 'complete.failed'; localId: string; error: UploadError; retryable: boolean }
  /** Internal completion for pause requests. */
  | { type: 'paused'; localId: string; cursor: AnyCursor<C>; pausedAt: number }
  /** Internal completion for cancel requests. */
  | { type: 'canceled'; localId: string; canceledAt: number }

// ============================================================================
// UPLOAD ITEM (STATE MACHINE)
// ============================================================================

/**
 * All possible upload phases.
 *
 * Useful for constraints and UI filtering.
 */
export type UploadPhase =
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
 * State of a single upload item.
 *
 * This is a discriminated union on `phase`.
 *
 * @typeParam M - Intent map
 * @typeParam C - Cursor map
 * @typeParam P - Purpose union
 */
export type UploadItem<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> =
  | {
      /** Validating file against rules. */
      phase: 'validating'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      createdAt: number
    }
  | {
      /** Requesting upload intent from backend. */
      phase: 'creating_intent'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      /** Current attempt number for this phase. */
      attempt: number
      createdAt: number
    }
  | {
      /** Intent received, ready to start upload. */
      phase: 'ready'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      intent: AnyIntent<M>
      createdAt: number
      cursor?: AnyCursor<C>
      progress?: UploadProgress
      attempt?: number
    }
  | {
      /** Queued for upload (waiting for slot). */
      phase: 'queued'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      intent: AnyIntent<M>
      /** Timestamp when this item requested a concurrency slot. */
      requestedAt: number
      createdAt: number
      cursor?: AnyCursor<C>
      progress?: UploadProgress
      attempt?: number
    }
  | {
      /** Actively uploading bytes. */
      phase: 'uploading'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      intent: AnyIntent<M>
      startedAt: number
      progress: UploadProgress
      createdAt: number
      cursor?: AnyCursor<C>
      attempt?: number
    }
  | {
      /** Upload paused (resumable). */
      phase: 'paused'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      intent: AnyIntent<M>
      cursor: AnyCursor<C>
      progress: UploadProgress
      pausedAt: number
      createdAt: number
      /**
       * File is optional because a paused item can be restored from persistence without a File.
       * Use `rebind` to attach the File again before resuming (when required).
       */
      file?: File
      attempt?: number
    }
  | {
      /** Bytes sent, finalizing with backend. */
      phase: 'completing'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      file: File
      intent: AnyIntent<M>
      progress: UploadProgress
      completingAt: number
      createdAt: number
      attempt?: number
    }
  | {
      /** Upload completed successfully. */
      phase: 'completed'
      localId: string
      file: File
      purpose: P
      fingerprint: FileFingerprint
      intent?: AnyIntent<M>
      completedBy: UploadCompletionKind
      result: R
      completedAt: number
      createdAt: number
      attempt?: number
    }
  | {
      /** Upload failed (retryable or final). */
      phase: 'error'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      error: UploadError
      retryable: boolean
      attempt: number
      failedAt: number
      createdAt: number
      file?: File
      intent?: AnyIntent<M>
      cursor?: AnyCursor<C>
      progress?: UploadProgress
    }
  | {
      /** Upload canceled by user/system. */
      phase: 'canceled'
      localId: string
      purpose: P
      fingerprint: FileFingerprint
      canceledAt: number
      createdAt: number
      file?: File
      intent?: AnyIntent<M>
      cursor?: AnyCursor<C>
      progress?: UploadProgress
      attempt?: number
    }
