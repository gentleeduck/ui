/**
 * S3/MinIO-style multipart strategy.
 *
 * For each part the strategy calls `api.multipart.signPart`, PUTs the
 * chunk, collects the ETag, and finalizes with
 * `api.multipart.completeMultipart`. Resumable: persisted ETags let a
 * follow-up run skip already-uploaded parts.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */

import type { Contracts, Strategy } from '../core/contracts'
import { sleep } from '../core/utils/async'

/**
 * Multipart strategy types and defaults.
 *
 * Houses the intent, cursor, and tuning defaults registered under the
 * `multipart` strategy id.
 *
 * @author wildduck2 <https://github.com/wildduck2>
 */
export namespace Multipart {
  /**
   * Intent returned by the backend for a multipart upload.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface IIntent {
    /** Discriminant for the strategy registry. */
    strategy: 'multipart'
    /** Backend's stable id for the file being uploaded. */
    fileId: string
    /** Backend's multipart-session id (used by `signPart`/`completeMultipart`). */
    uploadId: string
    /** Bytes per part. */
    partSize: number
    /** Total number of parts the backend expects. */
    partCount: number
    /** Optional fast path: pre-signed URLs for every part. */
    parts?: Array<{ partNumber: number; url: string; headers?: Record<string, string> }>
  }

  /**
   * Persisted resume state for a multipart upload.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export interface ICursor {
    /** Parts already uploaded, sorted by partNumber. */
    done: Array<{ partNumber: number; etag: string; size: number }>
    /** `true` once `completeMultipart` succeeded; skipped on resume. */
    completed?: true
  }

  /**
   * Per-strategy defaults.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  export namespace Defaults {
    /**
     * Default cap on parallel part PUTs.
     *
     * @author wildduck2 <https://github.com/wildduck2>
     */
    export const MAX_PART_CONCURRENCY = 4
    /**
     * Default per-part retry budget for transient failures.
     *
     * @author wildduck2 <https://github.com/wildduck2>
     */
    export const MAX_PART_RETRIES = 3
  }
}

function isAbort(err: unknown): boolean {
  return err instanceof Error && (err.name === 'AbortError' || /abort/i.test(err.message))
}

/** Scoped variance cast. Every call site builds a real `Multipart.ICursor`. */
function persistMultipartCursor<
  M extends Contracts.IntentMap & { multipart: Multipart.IIntent },
  C extends Contracts.CursorMap<M> & { multipart?: Multipart.ICursor },
  P extends string,
  R extends Contracts.IResultBase,
>(ctx: Strategy.ICtx<M, C, P, R, 'multipart'>, cursor: Multipart.ICursor): void {
  ctx.persistCursor(cursor as C['multipart'])
}

/**
 * Classify an error as transient (worth retrying) or final.
 *
 * Transient: network failures (status 0), HTTP 429 (rate limit), HTTP
 * 5xx. Final: everything else, including 4xx other than 429.
 *
 * @param err Value thrown by the transport or backend api.
 * @returns `true` when the engine should retry; `false` when the failure
 *   is final.
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function isTransientNetworkFailure(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { code?: unknown; status?: unknown; statusCode?: unknown }
  if (e.code === 'network') return true
  const status = typeof e.status === 'number' ? e.status : typeof e.statusCode === 'number' ? e.statusCode : undefined
  if (typeof status === 'number') return status === 429 || status >= 500
  return false
}

/**
 * Build a multipart strategy ready to register.
 *
 * @param opts Tuning knobs for part concurrency and retries.
 * @param opts.maxPartConcurrency Max parallel part PUTs. Default `4`.
 * @param opts.maxPartRetries Per-part retry budget for transient
 *   network / 5xx failures before the part fails terminally. Default
 *   `3`. Set to `0` to disable per-part retries and surface failures to
 *   the engine's retry policy on the next outer attempt.
 * @returns Strategy definition with id `'multipart'`.
 * @template M Intent map; must include `{ multipart: Multipart.IIntent }`.
 * @template C Cursor map; must include `{ multipart?: Multipart.ICursor }`.
 * @template P Purpose union; defaults to `string`.
 * @template R Backend result shape; defaults to `Contracts.IResultBase`.
 * @example
 * ```ts
 * import { createStrategyRegistry, multipartStrategy } from '@gentleduck/duck-upload'
 *
 * const strategies = createStrategyRegistry<MyIntents, MyCursors>()
 * strategies.set(multipartStrategy<MyIntents, MyCursors>({
 *   maxPartConcurrency: 6,
 *   maxPartRetries: 5,
 * }))
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export function multipartStrategy<
  M extends Contracts.IntentMap & { multipart: Multipart.IIntent },
  C extends Contracts.CursorMap<M> & { multipart?: Multipart.ICursor },
  P extends string = string,
  R extends Contracts.IResultBase = Contracts.IResultBase,
>(opts?: { maxPartConcurrency?: number; maxPartRetries?: number }): Strategy.IStrategy<M, C, P, R, 'multipart'> {
  const maxPartConcurrency = Math.max(1, opts?.maxPartConcurrency ?? Multipart.Defaults.MAX_PART_CONCURRENCY)
  const maxPartRetries = Math.max(0, opts?.maxPartRetries ?? Multipart.Defaults.MAX_PART_RETRIES)

  return {
    id: 'multipart',
    resumable: true,

    async start(ctx) {
      // Fast-exit if the controller is already aborted; skips signPart round-trip.
      if (ctx.signal.aborted) throw ctx.signal.reason ?? new Error('aborted')

      const intent = ctx.intent
      const totalBytes = ctx.file.size
      const partSize = Math.max(1, intent.partSize)
      const totalParts = Math.max(1, intent.partCount ?? Math.ceil(totalBytes / partSize))

      // Inner cascade controller: any non-recoverable part failure aborts
      // siblings so they stop wasting bandwidth on a session that will fail.
      const inner = new AbortController()
      const onOuterAbort = () => inner.abort(ctx.signal.reason)
      ctx.signal.addEventListener('abort', onOuterAbort, { once: true })
      const childSignal = inner.signal

      const cursor = ctx.readCursor()
      const done = new Map<number, { etag: string; size: number }>()
      // Sorted snapshot maintained incrementally; avoids O(n log n) rebuild per part.
      const sortedDone: Array<{ partNumber: number; etag: string; size: number }> = []
      if (cursor?.done) {
        for (const p of cursor.done) done.set(p.partNumber, { etag: p.etag, size: p.size })
        for (const p of cursor.done) sortedDone.push({ partNumber: p.partNumber, etag: p.etag, size: p.size })
        sortedDone.sort((a, b) => a.partNumber - b.partNumber)
      }

      const insertSorted = (entry: { partNumber: number; etag: string; size: number }) => {
        let lo = 0
        let hi = sortedDone.length
        while (lo < hi) {
          const mid = (lo + hi) >>> 1
          if (sortedDone[mid].partNumber < entry.partNumber) lo = mid + 1
          else hi = mid
        }
        if (lo < sortedDone.length && sortedDone[lo].partNumber === entry.partNumber) sortedDone[lo] = entry
        else sortedDone.splice(lo, 0, entry)
      }

      // Skip re-completing if a previous run already finalized the session.
      const alreadyCompleted = cursor?.completed === true

      const inflightBytes = new Map<number, number>()
      let finishedBytes = 0
      for (const v of done.values()) finishedBytes += v.size

      const report = () => {
        let inflight = 0
        for (const b of inflightBytes.values()) inflight += b
        ctx.reportProgress({ uploadedBytes: finishedBytes + inflight, totalBytes })
      }

      const partsToUpload: Array<{ partNumber: number; start: number; end: number }> = []
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        if (done.has(partNumber)) continue
        const start = (partNumber - 1) * partSize
        const end = Math.min(totalBytes, start + partSize)
        partsToUpload.push({ partNumber, start, end })
      }

      const queue = partsToUpload.slice()
      const running = new Set<Promise<void>>()

      const getSignedPart = async (partNumber: number) => {
        const fromIntent = intent.parts?.find((x) => x.partNumber === partNumber)
        if (fromIntent) return fromIntent

        if (!ctx.api.multipart?.signPart) {
          throw new Error(
            'multipart.signPart is missing in Contracts.IUploadApi. Implement it to call your backend sign-part endpoint.',
          )
        }

        const out = await ctx.api.multipart.signPart(
          { fileId: intent.fileId, uploadId: intent.uploadId, partNumber },
          { signal: childSignal },
        )
        return { partNumber, url: out.url, headers: out.headers }
      }

      const uploadOne = async (
        p: { partNumber: number; start: number; end: number },
        retryCount = 0,
      ): Promise<void> => {
        try {
          const blob = ctx.file.slice(p.start, p.end)
          const size = blob.size

          const signed = await getSignedPart(p.partNumber)

          const res = await ctx.transport.put({
            url: signed.url,
            body: blob,
            headers: signed.headers,
            signal: childSignal,
            onProgress: (loaded) => {
              inflightBytes.set(p.partNumber, loaded)
              report()
            },
          })

          inflightBytes.delete(p.partNumber)

          const etag = res.etag
          if (!etag) {
            throw new Error(
              'Missing ETag from upload part response. Ensure MinIO/S3 CORS exposes ETag (Access-Control-Expose-Headers: ETag).',
            )
          }

          finishedBytes += size
          done.set(p.partNumber, { etag, size })
          insertSorted({ partNumber: p.partNumber, etag, size })

          persistMultipartCursor(ctx, { done: sortedDone.slice() })
          report()
        } catch (err) {
          inflightBytes.delete(p.partNumber)

          if (childSignal.aborted || isAbort(err)) throw err

          if (retryCount < maxPartRetries && isTransientNetworkFailure(err)) {
            // Match the engine-level retry jitter (±20%) so simultaneous part
            // failures don't all retry on the same beat against the same
            // backend tick.
            const base = 2 ** retryCount * 500
            const jitter = base * 0.2 * (Math.random() * 2 - 1)
            await sleep(Math.max(0, Math.round(base + jitter)), childSignal)
            return uploadOne(p, retryCount + 1)
          }

          inner.abort(err)
          throw err
        }
      }

      try {
        if (partsToUpload.length === 0) {
          if (!alreadyCompleted) await completeMultipart()
          report()
          return
        }

        // Head-pointer cursor instead of `queue.shift()` so dequeue is O(1).
        let queueHead = 0
        try {
          while (queueHead < queue.length || running.size > 0) {
            while (queueHead < queue.length && running.size < maxPartConcurrency) {
              const next = queue[queueHead++]
              let task: Promise<void> | undefined
              const wrapped = uploadOne(next).finally(() => {
                if (task) running.delete(task)
              })
              task = wrapped
              running.add(wrapped)
            }
            if (running.size > 0) await Promise.race(running)
          }
        } catch (err) {
          // Race rejected; drain peer rejections so they each get a handler.
          if (running.size > 0) await Promise.allSettled(running)
          throw err
        }

        await completeMultipart()
        report()
      } finally {
        ctx.signal.removeEventListener('abort', onOuterAbort)
      }

      async function completeMultipart() {
        if (alreadyCompleted) return
        if (!ctx.api.multipart?.completeMultipart) {
          throw new Error(
            'multipart.completeMultipart is missing in Contracts.IUploadApi. Implement it to call your backend complete endpoint.',
          )
        }

        const parts = sortedDone.map(({ partNumber, etag }) => ({ partNumber, etag }))
        if (parts.length !== totalParts) {
          throw new Error(`Cannot complete multipart: expected ${totalParts} parts, got ${parts.length}`)
        }

        await ctx.api.multipart.completeMultipart(
          { fileId: intent.fileId, uploadId: intent.uploadId, parts },
          { signal: childSignal },
        )

        persistMultipartCursor(ctx, { done: sortedDone.slice(), completed: true })
      }
    },
  }
}
