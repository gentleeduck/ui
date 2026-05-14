/** Discriminated result returned by every service function for uniform error handling. */
export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string }

export type ProgressCallback = (message: string) => void
