/**
 * Presigned-POST strategy.
 *
 * Issues a single `multipart/form-data` POST with server-provided
 * fields. Non-resumable; suitable for small or medium files.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */

import type { Contracts, Strategy } from '../core/contracts'

/**
 * Presigned-POST strategy types.
 *
 * Houses the intent and cursor shapes registered under the `post`
 * strategy id.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Post {
  /**
   * Intent returned by the backend for a presigned-POST upload.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IIntent {
    /** Discriminant for the strategy registry. */
    strategy: 'post'
    /** Backend's stable file id. */
    fileId: string
    /** Presigned POST URL (form action). */
    url: string
    /** Form fields included before the file part. */
    fields: Record<string, string>
    /** Optional expiry of the presigned URL. */
    expiresAt?: string
  }

  /**
   * Progress-only cursor; the post strategy is not resumable.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ICursor {
    uploadedBytes: number
  }
}

/**
 * Build the presigned-POST strategy.
 *
 * Pass the result to `strategies.set()` after the registry is created.
 *
 * @returns Strategy definition with id `'post'`.
 * @template M Intent map; must include `{ post: Post.IIntent }`.
 * @template C Cursor map; optional `post?: Post.ICursor` for progress-only state.
 * @template P Purpose union; defaults to `string`.
 * @template R Backend result shape; defaults to `Contracts.IResultBase`.
 * @example
 * ```ts
 * import { createStrategyRegistry, PostStrategy } from '@gentleduck/duck-upload'
 *
 * const strategies = createStrategyRegistry<MyIntents, MyCursors>()
 * strategies.set(PostStrategy<MyIntents, MyCursors>())
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function PostStrategy<
  M extends Contracts.IntentMap & { post: Post.IIntent },
  C extends Contracts.CursorMap<M> & { post?: Post.ICursor },
  P extends string = string,
  R extends Contracts.IResultBase = Contracts.IResultBase,
>(): Strategy.IStrategy<M, C, P, R, 'post'> {
  return {
    id: 'post',
    resumable: false,

    async start(ctx) {
      const intent = ctx.intent

      // Fast-abort: cancel arrived between scheduling and start.
      if (ctx.signal.aborted) {
        throw ctx.signal.reason instanceof Error ? ctx.signal.reason : new DOMException('Upload aborted', 'AbortError')
      }

      if (!intent.url) throw new Error('Post strategy: intent missing `url`')

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
