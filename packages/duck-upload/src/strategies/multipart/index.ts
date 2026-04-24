/**
 * Multipart strategy implementation (S3/MinIO style).
 * Signs each part on demand (signPart), uploads via PUT, then completes with ETags.
 */

import type { CursorMap, IntentMap, UploadResultBase, UploadStrategy } from '../../core/contracts'
import { sleep } from '../../core/utils/async'

const DEFAULT_MAX_PART_CONCURRENCY = 4

export type MultipartIntent = {
  strategy: 'multipart'
  fileId: string
  uploadId: string
  partSize: number
  partCount: number

  // Optional legacy mode: backend might provide all urls up front
  parts?: Array<{
    partNumber: number
    url: string
    headers?: Record<string, string>
  }>
}

export type MultipartCursor = {
  done: Array<{
    partNumber: number
    etag: string
    size: number
  }>

  /**
   * Marks that the multipart session was completed on the backend (parts assembled).
   * This prevents re-sending completeMultipart on resume.
   */
  completed?: true
}

function isAbort(err: unknown) {
  return err instanceof Error && (err.name === 'AbortError' || /abort/i.test(err.message))
}

export function multipartStrategy<
  M extends IntentMap & { multipart: MultipartIntent },
  C extends CursorMap<M> & { multipart?: MultipartCursor },
  P extends string = string,
  R extends UploadResultBase = UploadResultBase,
>(opts?: { maxPartConcurrency?: number }): UploadStrategy<M, C, P, R, 'multipart'> {
  const maxPartConcurrency = Math.max(1, opts?.maxPartConcurrency ?? DEFAULT_MAX_PART_CONCURRENCY)

  return {
    id: 'multipart',
    resumable: true,

    async start(ctx) {
      const intent = ctx.intent
      const totalBytes = ctx.file.size
      const partSize = Math.max(1, intent.partSize)

      // Trust backend partCount if provided (important for maxParts rules)
      const totalParts = Math.max(1, intent.partCount ?? Math.ceil(totalBytes / partSize))

      // Restore cursor
      const cursor = ctx.readCursor()
      const done = new Map<number, { etag: string; size: number }>()
      if (cursor?.done) {
        for (const p of cursor.done) done.set(p.partNumber, { etag: p.etag, size: p.size })
      }

      // If we already completed the multipart session in a previous run, do not re-complete.
      // (The store will still run its generic finalization step.)
      const alreadyCompleted = cursor?.completed === true

      // Progress
      const inflightBytes = new Map<number, number>()
      let finishedBytes = 0
      for (const v of done.values()) finishedBytes += v.size

      const report = () => {
        let inflight = 0
        for (const b of inflightBytes.values()) inflight += b
        ctx.reportProgress({ uploadedBytes: finishedBytes + inflight, totalBytes })
      }

      // Build queue
      const partsToUpload: Array<{ partNumber: number; start: number; end: number }> = []
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        if (done.has(partNumber)) continue
        const start = (partNumber - 1) * partSize
        const end = Math.min(totalBytes, start + partSize)
        partsToUpload.push({ partNumber, start, end })
      }

      if (partsToUpload.length === 0) {
        if (!alreadyCompleted) await completeMultipart()
        report()
        return
      }

      const queue = partsToUpload.slice()
      const running = new Set<Promise<void>>()

      const getSignedPart = async (partNumber: number) => {
        // Legacy fast path: intent.parts provided
        const fromIntent = intent.parts?.find((x) => x.partNumber === partNumber)
        if (fromIntent) return fromIntent

        // Normal path: ask backend for this part url
        if (!ctx.api.multipart?.signPart) {
          throw new Error(
            'multipart.signPart is missing in UploadApi. Implement it to call your backend sign-part endpoint.',
          )
        }

        const out = await ctx.api.multipart.signPart(
          { fileId: intent.fileId, uploadId: intent.uploadId, partNumber },
          { signal: ctx.signal },
        )

        return { partNumber, url: out.url, headers: out.headers }
      }

      const uploadOne = async (
        p: { partNumber: number; start: number; end: number },
        retryCount = 0,
      ): Promise<void> => {
        const maxRetries = 3
        try {
          const blob = ctx.file.slice(p.start, p.end)
          const size = blob.size

          const signed = await getSignedPart(p.partNumber)

          const res = await ctx.transport.put({
            url: signed.url,
            body: blob,
            headers: signed.headers,
            signal: ctx.signal,
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

          const snapshot: MultipartCursor = {
            done: Array.from(done.entries())
              .map(([partNumber, v]) => ({ partNumber, etag: v.etag, size: v.size }))
              .sort((a, b) => a.partNumber - b.partNumber),
          }
          ctx.persistCursor(snapshot as C['multipart'])
          report()
        } catch (err) {
          inflightBytes.delete(p.partNumber)

          if (ctx.signal?.aborted || isAbort(err)) throw err

          // basic retry for network-ish failures
          if (retryCount < maxRetries) {
            const msg = err instanceof Error ? err.message : String(err)
            const retryable =
              /network/i.test(msg) ||
              /timeout/i.test(msg) ||
              /5\d\d/.test(msg) ||
              /ECONNRESET/i.test(msg) ||
              /EHOSTUNREACH/i.test(msg)

            if (retryable) {
              await sleep(2 ** retryCount * 500)
              return uploadOne(p, retryCount + 1)
            }
          }

          throw err
        }
      }

      while (queue.length > 0 || running.size > 0) {
        while (queue.length > 0 && running.size < maxPartConcurrency) {
          const next = queue.shift()
          if (!next) break

          let task: Promise<void> | undefined
          const wrapped = uploadOne(next).finally(() => {
            if (task) running.delete(task)
          })
          task = wrapped
          running.add(wrapped)
        }

        if (running.size > 0) {
          await Promise.race(running)
        }
      }

      await completeMultipart()
      report()

      async function completeMultipart() {
        if (alreadyCompleted) return
        if (!ctx.api.multipart?.completeMultipart) {
          throw new Error(
            'multipart.completeMultipart is missing in UploadApi. Implement it to call your backend complete endpoint.',
          )
        }

        const parts = Array.from(done.entries())
          .map(([partNumber, v]) => ({ partNumber, etag: v.etag }))
          .sort((a, b) => a.partNumber - b.partNumber)

        if (parts.length !== totalParts) {
          throw new Error(`Cannot complete multipart: expected ${totalParts} parts, got ${parts.length}`)
        }

        await ctx.api.multipart.completeMultipart(
          { fileId: intent.fileId, uploadId: intent.uploadId, parts },
          { signal: ctx.signal },
        )

        // Persist "completed" marker so resume doesn't re-complete.
        const snapshot: MultipartCursor = {
          done: Array.from(done.entries())
            .map(([partNumber, v]) => ({ partNumber, etag: v.etag, size: v.size }))
            .sort((a, b) => a.partNumber - b.partNumber),
          completed: true,
        }
        ctx.persistCursor(snapshot as C['multipart'])
      }
    },
  }
}
