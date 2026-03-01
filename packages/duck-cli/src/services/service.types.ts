/**
 * Discriminated union for service operation results.
 * All service functions return this type for consistent error handling.
 *
 * On success: { ok: true, data: T }
 * On failure: { ok: false, error: string }
 */
export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string }

/**
 * Callback for reporting progress during long-running operations.
 * Used by services to update spinners and status messages.
 */
export type ProgressCallback = (message: string) => void
