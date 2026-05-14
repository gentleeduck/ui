/**
 * Presigned-POST strategy: a single `multipart/form-data` POST with
 * server-provided fields. Non-resumable; suitable for small/medium files.
 */

import type { CursorMap, IntentMap, UploadResultBase, UploadStrategy } from '../../core/contracts'

export type PostIntent = {
  strategy: 'post'
  fileId: string
  /** Presigned POST URL (form action). */
  url: string
  /** Form fields to include before the file. */
  fields: Record<string, string>
  /** Optional expiry of the presigned URL. */
  expiresAt?: string
}

export type PostCursor = {
  /** Bytes uploaded — progress display only; not used for resume. */
  uploadedBytes: number
}

export function PostStrategy<
  M extends IntentMap & { post: PostIntent },
  C extends CursorMap<M> & { post?: PostCursor },
  P extends string = string,
  R extends UploadResultBase = UploadResultBase,
>(): UploadStrategy<M, C, P, R, 'post'> {
  return {
    id: 'post',
    resumable: false,

    async start(ctx) {
      const intent = ctx.intent

      if (!intent.url) {
        throw new Error('Direct strategy: intent missing url/uploadUrl')
      }

      await ctx.transport.postForm({
        url: intent.url,
        file: ctx.file,
        fields: intent.fields,
        filename: ctx.file.name,
        signal: ctx.signal,
        onProgress(uploadedBytes, totalBytes) {
          ctx.reportProgress({ uploadedBytes, totalBytes })
        },
      })
    },
  }
}
