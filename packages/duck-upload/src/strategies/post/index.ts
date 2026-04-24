/**
 * @fileoverview POST strategy implementation for simple file uploads.
 *
 * Implements the presigned POST upload strategy, suitable for:
 * - Small to medium files (< 100MB typically)
 * - Simple uploads without resume capability
 * - Direct form-based uploads to S3 or similar storage
 *
 * The strategy uses multipart/form-data POST requests with presigned
 * form fields provided by the backend. This is the simplest upload
 * method and doesn't support resumable uploads.
 *
 * @module upload-strategies/post
 */

import type { CursorMap, IntentMap, UploadResultBase, UploadStrategy } from '../../core/contracts'

// ============================================================================
// POST INTENT TYPE
// ============================================================================

export type PostIntent = {
  /** Strategy identifier - must be 'post' */
  strategy: 'post'
  /** Backend file identifier */
  fileId: string
  /** Presigned POST URL (form action) */
  url: string
  /** Form fields to include before the file */
  fields: Record<string, string>
  /** Optional expiration timestamp for the presigned URL */
  expiresAt?: string
}

// ============================================================================
// POST CURSOR TYPE
// ============================================================================

export type PostCursor = {
  /** Bytes uploaded (for progress display only) */
  uploadedBytes: number
}

// ============================================================================
// POST STRATEGY
// ============================================================================

export function PostStrategy<
  M extends IntentMap & { post: PostIntent },
  C extends CursorMap<M> & { post?: PostCursor },
  P extends string = string,
  R extends UploadResultBase = UploadResultBase,
>(): UploadStrategy<M, C, P, R, 'post'> {
  return {
    /** Strategy identifier */
    id: 'post',

    /** POST uploads are not resumable */
    resumable: false,

    /**
     * Execute the POST upload.
     *
     * @param ctx - Strategy context
     * @throws Error if intent is missing URL
     */
    async start(ctx) {
      const intent = ctx.intent

      // Validate intent has required URL
      if (!intent.url) {
        throw new Error('Direct strategy: intent missing url/uploadUrl')
      }

      // Upload using form POST
      await ctx.transport.postForm({
        url: intent.url,
        file: ctx.file,
        fields: intent.fields,
        filename: ctx.file.name,
        signal: ctx.signal,
        /**
         * Report progress during upload.
         * @param uploadedBytes - Bytes uploaded so far
         * @param totalBytes - Total file size
         */
        onProgress(uploadedBytes, totalBytes) {
          ctx.reportProgress({ uploadedBytes, totalBytes })
        },
      })
    },
  }
}
