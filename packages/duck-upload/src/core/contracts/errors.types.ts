/**
 * File rejection reasons produced by client-side validation.
 *
 * These should be safe to show in UI.
 */
export type RejectReason =
  | { code: 'empty_file' }
  | { code: 'file_too_large'; maxBytes: number; size: number }
  | { code: 'type_not_allowed'; allowed: string[]; got: string }
  | { code: 'too_many_files'; max: number }

/**
 * Base interface for custom errors.
 *
 * If you want to add domain-specific fields, extend this and intersect in {@link UploadError}.
 */
export interface UploadErrorBase {
  /** Stable error code. */
  code: string
  /** Human-friendly message (safe for UI). */
  message: string
  /** Optional cause (original error, response, etc). */
  cause?: unknown
  /** Whether the error should be retried. */
  retryable?: boolean
}

/**
 * Built-in engine errors.
 *
 * Keep these narrow and explicit so reducer logic can rely on `code` as a discriminant.
 */
export type BuiltInUploadError =
  | { code: 'validation_failed'; message: string; reason: RejectReason; retryable?: false }
  | { code: 'strategy_missing'; message: string; strategy: string; retryable?: false }
  | { code: 'aborted'; message: string; reason: 'pause' | 'cancel' | 'unknown'; cause?: unknown; retryable?: false }
  | { code: 'network'; message: string; cause?: unknown; retryable?: boolean }
  | { code: 'http'; message: string; status: number; statusText?: string; cause?: unknown; retryable?: boolean }
  | { code: 'timeout'; message: string; cause?: unknown; retryable?: boolean }
  | { code: 'auth'; message: string; cause?: unknown; retryable?: false }
  | { code: 'rate_limit'; message: string; retryAfterMs?: number; cause?: unknown; retryable?: boolean }
  | { code: 'server'; message: string; serverCode?: string; cause?: unknown; retryable?: boolean }
  | { code: 'unknown'; message: string; cause?: unknown; retryable?: boolean }

/**
 * The error type used everywhere in the engine.
 *
 * You can extend this by intersecting your own shape with {@link UploadErrorBase}
 * to add fields (example: `{ endpoint: string }`).
 */
export type UploadError = BuiltInUploadError | (UploadErrorBase & Record<string, unknown>)

/**
 * Validation rules applied on `addFiles` before an item enters the upload pipeline.
 */
export type UploadValidationRules = {
  /** Maximum number of files allowed. */
  maxFiles?: number
  /** Maximum file size in bytes. */
  maxSizeBytes?: number
  /** Minimum file size in bytes. */
  minSizeBytes?: number
  /** Allowed MIME types. */
  allowedTypes?: string[]
  /** Allowed file extensions. */
  allowedExtensions?: string[]
}
