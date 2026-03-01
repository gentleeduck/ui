export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string }

export type ProgressCallback = (message: string) => void
