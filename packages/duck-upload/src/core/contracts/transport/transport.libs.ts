import { isRecord } from '../../utils/guards'

// ============================================================================
// ABORT HANDLING UTILITIES
// ============================================================================

export function abortReason(signal?: AbortSignal): unknown {
  return signal?.reason
}

export function normalizeAbortReason(r: unknown): 'pause' | 'cancel' | 'unknown' {
  if (!r) return 'unknown'

  // Direct string match
  if (typeof r === 'string') {
    if (r === 'pause' || r === 'cancel') return r
    return 'unknown'
  }

  // Object with 'reason' property (from controller.abort({ reason: 'pause' }))
  if (isRecord(r) && 'reason' in r) {
    const v = r.reason
    if (v === 'pause' || v === 'cancel') return v
  }

  // Object with 'kind' property (alternative format)
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

// ============================================================================
// ERROR HANDLING HELPERS
// ============================================================================

/**
 * Creates an error for network failures, including CORS detection.
 *
 * @param xhr - XMLHttpRequest instance to check status
 * @param defaultMessage - Default error message if status is non-zero
 *
 * @returns {Error} Appropriate error message based on XHR status
 */
export function createNetworkError(xhr: XMLHttpRequest, defaultMessage: string): Error {
  // Status 0 typically indicates CORS failure or network error
  if (xhr.status === 0) {
    return new Error(
      'CORS error: The upload server does not allow requests from this origin. Please check CORS configuration.',
    )
  }
  return new Error(`${defaultMessage} (status: ${xhr.status})`)
}

// ============================================================================
// RESPONSE PARSING
// ============================================================================

/**
 * Parses XHR response headers into a key-value object.
 * Headers are normalized to lowercase keys.
 *
 * @param xhr - XMLHttpRequest instance
 *
 * @returns {Record<string, string>} Parsed headers object
 */
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
