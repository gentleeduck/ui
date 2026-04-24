import type {
  AnyCursor,
  CursorMap,
  FileFingerprint,
  IntentMap,
  RejectReason,
  UploadError,
  UploadResultBase,
} from '../contracts'
import type { UploadCompletionKind } from './outcome.types'

/**
 * Public event map emitted to consumers.
 *
 * Consumers subscribe via {@link TypedEmitter.on}.
 */
export type UploadEventMap<
  M extends IntentMap,
  C extends CursorMap<M>,
  P extends string,
  R extends UploadResultBase = UploadResultBase,
> = {
  'file.added': { localId: string; purpose: P; file: File; fingerprint: FileFingerprint }
  'file.rejected': { file: File; reason: RejectReason }

  'validation.ok': { localId: string }
  'validation.failed': { localId: string; reason: RejectReason }

  'intent.creating': { localId: string }
  'intent.created': { localId: string; intent: M[keyof M] }
  'intent.failed': { localId: string; error: UploadError; retryable: boolean }

  'upload.queued': { localId: string }
  'upload.resumed': { localId: string }
  'upload.started': { localId: string }
  'upload.progress': { localId: string; pct: number; uploadedBytes: number; totalBytes: number }
  'upload.cursor': { localId: string; cursor: AnyCursor<C> }
  'upload.paused': { localId: string; cursor: AnyCursor<C> }
  'upload.canceled': { localId: string }

  'upload.completing': { localId: string }
  'upload.completed': { localId: string; result: R; completedBy: UploadCompletionKind }

  'upload.error': { localId: string; error: UploadError; retryable: boolean }
}
