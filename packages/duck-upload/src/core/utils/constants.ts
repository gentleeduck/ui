/**
 * Default retry delay base in milliseconds.
 * Used for exponential backoff calculation: base * 2^(attempt - 1)
 */
export const DEFAULT_RETRY_DELAY_BASE_MS = 500

/**
 * Maximum retry delay in milliseconds.
 * Caps exponential backoff to prevent excessive delays.
 */
export const DEFAULT_RETRY_DELAY_MAX_MS = 10_000

/**
 * Default progress event throttle in milliseconds.
 * Prevents excessive progress updates from overwhelming the UI.
 */
export const DEFAULT_PROGRESS_THROTTLE_MS = 100

/**
 * Default maximum number of retry attempts.
 */
export const DEFAULT_MAX_ATTEMPTS = 3

/**
 * Default maximum number of concurrent uploads.
 */
export const DEFAULT_MAX_CONCURRENT_UPLOADS = 3

/**
 * Default maximum number of items to keep in memory.
 */
export const DEFAULT_MAX_ITEMS = 100
