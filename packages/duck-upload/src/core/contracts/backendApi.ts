import type { IntentMap } from './intent.types'
import type { UploadResultBase } from './result.types'

export type WithSignal = { signal?: AbortSignal }

// Backend API contract (typed, injected)
export interface UploadApi<M extends IntentMap, P extends string, R extends UploadResultBase = UploadResultBase> {
  // Create upload intent - backend decides strategy, bucket, key
  createIntent(
    args: {
      purpose: P
      contentType: string
      size: number
      filename: string
      checksum?: string
    },
    opts?: WithSignal,
  ): Promise<M[keyof M]>

  // Finalize upload (mark as complete in DB, return metadata)
  complete(args: { fileId: string }, opts?: WithSignal): Promise<R>

  // Get signed preview URL
  getSignedPreviewUrl?(args: { fileId: string; key: string; purpose: P }, opts?: WithSignal): Promise<string>

  /**
   * Optional support for finding existing files by checksum for deduplication.
   * If implemented, the upload engine will check for existing files before uploading.
   * If a file with the same checksum exists, the upload will be skipped and the existing file will be linked.
   */
  findByChecksum?(args: { checksum: string; purpose: P }, opts?: WithSignal): Promise<R | null>

  // Multipart-specific operations (optional, for multipart strategy)
  multipart?: {
    signPart(
      args: { fileId: string; uploadId: string; partNumber: number; checksum?: string },
      opts?: WithSignal,
    ): Promise<{ url: string; headers?: Record<string, string> }>

    completeMultipart(
      args: { fileId: string; uploadId: string; parts: Array<{ partNumber: number; etag: string }> },
      opts?: WithSignal,
    ): Promise<unknown>

    listParts?(
      args: { fileId: string; uploadId: string },
      opts?: WithSignal,
    ): Promise<Array<{ partNumber: number; etag?: string; size?: number }>>

    abort?(args: { fileId: string; uploadId: string }, opts?: WithSignal): Promise<void>
  }

  // TUS-specific operations (optional, for tus strategy)
  tus?: {
    create(
      args: { fileId: string; size: number; filename: string; contentType: string },
      opts?: WithSignal,
    ): Promise<{ uploadUrl: string }>

    getOffset(args: { uploadUrl: string }, opts?: WithSignal): Promise<{ offset: number }>
  }
}
