import { isRecord } from '../../utils/guards'

export function abortReason(signal?: AbortSignal): unknown {
  return signal?.reason
}

/**
 * Map `controller.abort(reason)` payloads to `'pause' | 'cancel'`. Accepts a
 * bare string, `{ reason }`, or `{ kind }` shape.
 */
export function normalizeAbortReason(r: unknown): 'pause' | 'cancel' | 'unknown' {
  if (!r) return 'unknown'

  if (typeof r === 'string') {
    if (r === 'pause' || r === 'cancel') return r
    return 'unknown'
  }

  if (isRecord(r) && 'reason' in r) {
    const v = r.reason
    if (v === 'pause' || v === 'cancel') return v
  }

  if (isRecord(r) && 'kind' in r) {
    const v = r.kind
    if (v === 'pause' || v === 'cancel') return v
  }

  return 'unknown'
}

export class UploadAbortError extends Error {
  readonly code: 'aborted' = 'aborted'
  reason: 'pause' | 'cancel' | 'unknown'

  constructor(reason: unknown) {
    super('Upload aborted')
    this.reason = normalizeAbortReason(reason)
  }
}

export function makeAbortError(reason: unknown): UploadAbortError {
  return new UploadAbortError(reason)
}

/** XHR network error with `status === 0` heuristic for CORS detection. */
export function createNetworkError(xhr: XMLHttpRequest, defaultMessage: string): Error {
  // status 0 → CORS failure or transport-level network error.
  if (xhr.status === 0) {
    return new Error(
      'CORS error: The upload server does not allow requests from this origin. Please check CORS configuration.',
    )
  }
  return new Error(`${defaultMessage} (status: ${xhr.status})`)
}

/** Parse XHR headers into a lowercase-keyed record. */
export function parseHeaders(xhr: XMLHttpRequest): Record<string, string> {
  const headers: Record<string, string> = {}
  const headerStr = xhr.getAllResponseHeaders()

  headerStr
    .split('\r\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(':')
      if (idx <= 0) return
      const key = line.slice(0, idx).trim().toLowerCase()
      const value = line.slice(idx + 1).trim()
      if (key) headers[key] = value
    })

  return headers
}
