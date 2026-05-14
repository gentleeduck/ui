import type { UploadConfig } from '../../client'
import type { AnyCursor, CursorMap, IntentMap, UploadError, UploadResultBase } from '../../contracts'
import { DEFAULT_RETRY_DELAY_BASE_MS, DEFAULT_RETRY_DELAY_MAX_MS } from '../../utils/constants'
import { computeFingerprint, fingerprintMatches } from '../../utils/fingerprint'
import { isRecord } from '../../utils/guards'
import type { UploadItem } from '../internal-events.types'

export { sleep } from '../../utils/async'

import type { StoreOptions } from './store.types'

/** SHA-256 checksum of `file` for deduplication. */
export async function calculateFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Resolve auto-start config: `false | undefined` (never), `P[]` (in list), or
 * `(purpose) => boolean` predicate.
 */
export function isAutoStart<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  opts: StoreOptions<M, C, P, R>,
  purpose: P,
): boolean {
  const v = opts.config?.autoStart
  if (v === undefined) return false
  if (Array.isArray(v)) return v.includes(purpose)
  if (typeof v === 'function') return v(purpose)
  return false
}

/**
 * Lightweight `File` fingerprint for display/identity. For stronger identity
 * (SHA-256), pass {@link StoreOptions.fingerprint} or let add-file compute a
 * checksum asynchronously.
 */
export { computeFingerprint, fingerprintMatches }

/**
 * Normalize a thrown value into an {@link UploadError}. Override via
 * {@link StoreOptions.errorNormalizer}. Default: aborts → non-retryable;
 * network errors → retryable; HTTP 5xx/429 → retryable.
 */
export function normalizeError(err: unknown, customNormalizer?: (err: unknown) => UploadError): UploadError {
  if (customNormalizer) return customNormalizer(err)

  // Transport aborts carry `{ code: 'aborted', reason: 'pause' | 'cancel' }`.
  if (isAbortError(err)) {
    return { code: 'aborted', message: 'Upload aborted', reason: String(err.reason ?? 'unknown'), retryable: false }
  }

  const msg = isRecord(err) && typeof err.message === 'string' ? err.message : 'Unknown error'

  if (String(msg).toLowerCase().includes('network') || String(msg).toLowerCase().includes('fetch')) {
    return { code: 'network', message: String(msg), cause: err, retryable: true }
  }

  if (isRecord(err) && (typeof err.status === 'number' || typeof err.statusCode === 'number')) {
    const status = (typeof err.status === 'number' ? err.status : err.statusCode) as number
    const retryable = status >= 500 || status === 429
    return { code: 'http', status, message: String(msg), cause: err, retryable }
  }

  return { code: 'unknown', message: String(msg), cause: err, retryable: false }
}

/** Item has a concrete backend intent. */
export function hasIntent<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { intent: M[keyof M] }> {
  return 'intent' in item && !!item.intent
}

/** Item has a bound `File`. Persisted items may lack it until the UI re-binds. */
export function hasFile<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { file: File }> {
  return 'file' in item && !!item.file
}

/** Item variant carries a cursor field (depends on phase/strategy). */
export function hasCursor<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { cursor?: AnyCursor<C> }> {
  return 'cursor' in item
}

/** Best-effort guard used to issue multipart-abort calls on cancel. */
export function isMultipartIntent(
  intent: unknown,
): intent is { strategy: 'multipart'; fileId: string; uploadId: string; partSize: number } {
  return (
    isRecord(intent) &&
    intent.strategy === 'multipart' &&
    typeof intent.fileId === 'string' &&
    typeof intent.uploadId === 'string'
  )
}

export function isAbortError(err: unknown): err is { code: 'aborted'; reason?: unknown } {
  return isRecord(err) && err.code === 'aborted'
}

/**
 * Decide whether to retry. Defers to `config.retryPolicy` when set.
 * Default: never retries `auth`/`validation_failed`/`strategy_missing`/`aborted`;
 * otherwise exponential backoff up to `maxAttempts`, capped at `DEFAULT_RETRY_DELAY_MAX_MS`.
 */
export function retryDecision<P extends string>(
  config: UploadConfig<P>,
  ctx: { phase: 'intent' | 'upload' | 'complete'; attempt: number; error: UploadError },
) {
  if (config.retryPolicy) return config.retryPolicy(ctx)

  if (ctx.error.code === 'auth') return { retryable: false }
  if (ctx.error.code === 'validation_failed') return { retryable: false }
  if (ctx.error.code === 'strategy_missing') return { retryable: false }
  if (ctx.error.code === 'aborted') return { retryable: false }

  const maxAttempts = config.maxAttempts
  const retryable = ctx.attempt < maxAttempts
  if (!retryable) return { retryable: false }

  const delayMs = Math.min(DEFAULT_RETRY_DELAY_MAX_MS, DEFAULT_RETRY_DELAY_BASE_MS * 2 ** (ctx.attempt - 1))
  return { retryable: true, delayMs }
}
