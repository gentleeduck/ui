import type { UploadConfig } from '../../client'
import type { AnyCursor, CursorMap, IntentMap, UploadError, UploadResultBase } from '../../contracts'
import { DEFAULT_RETRY_DELAY_BASE_MS, DEFAULT_RETRY_DELAY_MAX_MS } from '../../utils/constants'
import { computeFingerprint, fingerprintMatches } from '../../utils/fingerprint'
import { isRecord } from '../../utils/guards'
import type { UploadItem } from '../internal-events.types'

export { sleep } from '../../utils/async'

import type { StoreOptions } from './store.types'

/**
 * Calculates SHA256 checksum of a file for deduplication.
 * Uses Web Crypto API for efficient hashing.
 */
export async function calculateFileChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Determines whether items for a given purpose should auto-start.
 *
 * Supports three configuration shapes:
 * - `false | undefined`: never auto-start
 * - `P[]`: auto-start for purposes included in the list
 * - `(purpose: P) => boolean`: custom predicate
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
 * Builds a lightweight fingerprint from a {@link File}.
 *
 * This fingerprint is used for display and basic identity. If you need stronger identity
 * (e.g. SHA-256), provide a custom {@link StoreOptions.fingerprint} function or let the
 * add-file handler compute a checksum asynchronously.
 */
export { computeFingerprint, fingerprintMatches }

/**
 * Normalizes unknown thrown values into the engine's {@link UploadError} shape.
 *
 * You can provide a custom normalizer through {@link StoreOptions.errorNormalizer}.
 * Built-in behavior:
 * - detects abort errors and marks them non-retryable
 * - classifies common network and HTTP errors as retryable where appropriate
 */
export function normalizeError(err: unknown, customNormalizer?: (err: unknown) => UploadError): UploadError {
  if (customNormalizer) return customNormalizer(err)

  // Transport abort errors can carry {code:'aborted', reason:'pause'|'cancel'}
  if (isAbortError(err)) {
    return { code: 'aborted', message: 'Upload aborted', reason: String(err.reason ?? 'unknown'), retryable: false }
  }

  const msg = isRecord(err) && typeof err.message === 'string' ? err.message : 'Unknown error'

  // Network errors
  if (String(msg).toLowerCase().includes('network') || String(msg).toLowerCase().includes('fetch')) {
    return { code: 'network', message: String(msg), cause: err, retryable: true }
  }

  // HTTP errors
  if (isRecord(err) && (typeof err.status === 'number' || typeof err.statusCode === 'number')) {
    const status = (typeof err.status === 'number' ? err.status : err.statusCode) as number
    const retryable = status >= 500 || status === 429
    return { code: 'http', status, message: String(msg), cause: err, retryable }
  }

  return { code: 'unknown', message: String(msg), cause: err, retryable: false }
}

/**
 * Type guard for items that currently hold a concrete backend intent.
 */
export function hasIntent<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { intent: M[keyof M] }> {
  return 'intent' in item && !!item.intent
}

/**
 * Type guard for items that currently have a bound {@link File}.
 *
 * Persisted items restored from storage may lack `file` until the UI re-binds it.
 */
export function hasFile<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { file: File }> {
  return 'file' in item && !!item.file
}

/**
 * Type guard that narrows to item variants carrying a cursor field.
 *
 * Cursor presence depends on the current phase and the strategy.
 */
export function hasCursor<M extends IntentMap, C extends CursorMap<M>, P extends string, R extends UploadResultBase>(
  item: UploadItem<M, C, P, R>,
): item is Extract<UploadItem<M, C, P, R>, { cursor?: AnyCursor<C> }> {
  return 'cursor' in item
}

/**
 * Runtime guard for multipart intent objects.
 *
 * Used for best-effort abort calls when canceling multipart uploads.
 */
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

/**
 * Runtime guard for abort errors produced by the transport/strategy layer.
 */
export function isAbortError(err: unknown): err is { code: 'aborted'; reason?: unknown } {
  return isRecord(err) && err.code === 'aborted'
}

/**
 * Small helper to narrow unknown values to objects.
 */

/**
 * Computes whether a failed operation should be retried and, if so, after what delay.
 *
 * If {@link UploadConfig.retryPolicy} is provided it is used as the source of truth.
 * Otherwise the default policy:
 * - never retries auth/validation/strategy_missing/aborted
 * - retries up to `maxAttempts` with exponential backoff and a fixed cap
 */
export function retryDecision<P extends string>(
  config: UploadConfig<P>,
  ctx: { phase: 'intent' | 'upload' | 'complete'; attempt: number; error: UploadError },
) {
  if (config.retryPolicy) return config.retryPolicy(ctx)

  // Default: retry network/server unknown errors, not auth/validation/strategy_missing
  if (ctx.error.code === 'auth') return { retryable: false }
  if (ctx.error.code === 'validation_failed') return { retryable: false }
  if (ctx.error.code === 'strategy_missing') return { retryable: false }
  if (ctx.error.code === 'aborted') return { retryable: false }

  const maxAttempts = config.maxAttempts
  const retryable = ctx.attempt < maxAttempts
  if (!retryable) return { retryable: false }

  // Exponential backoff with cap
  const delayMs = Math.min(DEFAULT_RETRY_DELAY_MAX_MS, DEFAULT_RETRY_DELAY_BASE_MS * 2 ** (ctx.attempt - 1))
  return { retryable: true, delayMs }
}
