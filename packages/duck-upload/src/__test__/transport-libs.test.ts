import { describe, expect, test } from 'vitest'
import { makeAbortError, normalizeAbortReason, UploadAbortError } from '../core/contracts/transport/transport.libs'

describe('normalizeAbortReason', () => {
  test('passes bare strings through when valid', () => {
    expect(normalizeAbortReason('pause')).toBe('pause')
    expect(normalizeAbortReason('cancel')).toBe('cancel')
  })

  test('unknown bare strings degrade to "unknown"', () => {
    expect(normalizeAbortReason('shutdown')).toBe('unknown')
    expect(normalizeAbortReason(undefined)).toBe('unknown')
    expect(normalizeAbortReason(null)).toBe('unknown')
  })

  test('extracts .reason and .kind from object payloads', () => {
    expect(normalizeAbortReason({ reason: 'pause' })).toBe('pause')
    expect(normalizeAbortReason({ kind: 'cancel' })).toBe('cancel')
  })

  test('arrays do not crash and degrade to unknown', () => {
    expect(normalizeAbortReason(['pause'])).toBe('unknown')
  })
})

describe('UploadAbortError / makeAbortError', () => {
  test('exposes a stable code', () => {
    const e = makeAbortError('pause')
    expect(e).toBeInstanceOf(UploadAbortError)
    expect(e.code).toBe('aborted')
    expect(e.reason).toBe('pause')
  })

  test('defaults unknown reasons', () => {
    expect(makeAbortError(undefined).reason).toBe('unknown')
  })

  test('structured payloads with a known reason still normalize to pause/cancel', () => {
    expect(new UploadAbortError({ reason: 'cancel', extra: 'meta' }).reason).toBe('cancel')
    expect(new UploadAbortError({ kind: 'pause' }).reason).toBe('pause')
  })
})
