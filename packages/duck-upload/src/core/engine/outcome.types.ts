import type { UploadError, UploadResultBase } from '../contracts'

export type UploadCompletionKind = 'upload' | 'dedupe'

export type UploadOutcome<R extends UploadResultBase> =
  | { localId: string; status: 'completed'; completedBy: UploadCompletionKind; result: R }
  | { localId: string; status: 'error'; error: UploadError }
  | { localId: string; status: 'canceled' }
  | { localId: string; status: 'missing' }
