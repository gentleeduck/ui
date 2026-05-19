import { describe, expect, test } from 'vitest'
import { resolveUploadConfig } from '../core/client'
import {
  calculateFileChecksum,
  isAbortError,
  isMultipartIntent,
  normalizeError,
  retryDecision,
} from '../core/engine/store/store.libs'

describe('normalizeError', () => {
  test('honors a custom normalizer', () => {
    const err = normalizeError('anything', () => ({ code: 'auth', message: 'no', retryable: false }))
    expect(err.code).toBe('auth')
  })

  test('classifies abort-shaped errors as aborted/non-retryable', () => {
    const err = normalizeError({ code: 'aborted', reason: 'cancel' })
    expect(err.code).toBe('aborted')
    expect(err.retryable).toBe(false)
  })

  test('thrown value with statusCode alias classifies as http', () => {
    const err = normalizeError({ statusCode: 503, message: 'down' })
    expect(err.code).toBe('http')
    expect((err as { status?: number }).status).toBe(503)
    expect(err.retryable).toBe(true)
  })

  test('http 5xx is retryable', () => {
    const err = normalizeError({ status: 503, message: 'down' })
    expect(err.code).toBe('http')
    expect(err.retryable).toBe(true)
  })

  test('http 429 is retryable', () => {
    const err = normalizeError({ status: 429, message: 'slow down' })
    expect(err.code).toBe('http')
    expect(err.retryable).toBe(true)
  })

  test('http 400 is not retryable', () => {
    const err = normalizeError({ status: 400, message: 'bad' })
    expect(err.code).toBe('http')
    expect(err.retryable).toBe(false)
  })

  test('falls back to unknown non-retryable', () => {
    const err = normalizeError({})
    expect(err.code).toBe('unknown')
    expect(err.retryable).toBe(false)
  })
})

describe('retryDecision', () => {
  const config = resolveUploadConfig({ maxAttempts: 3 })

  test('auth errors never retry', () => {
    expect(
      retryDecision(config, { phase: 'intent', attempt: 1, error: { code: 'auth', message: '' } as never }),
    ).toEqual({
      retryable: false,
    })
  })

  test('validation_failed never retries', () => {
    expect(
      retryDecision(config, {
        phase: 'intent',
        attempt: 1,
        error: { code: 'validation_failed', message: '', reason: { code: 'empty_file' } } as never,
      }),
    ).toEqual({ retryable: false })
  })

  test('aborted never retries', () => {
    expect(
      retryDecision(config, { phase: 'upload', attempt: 1, error: { code: 'aborted', message: '' } as never }),
    ).toEqual({ retryable: false })
  })

  test('stops retrying once attempt >= maxAttempts', () => {
    expect(
      retryDecision(config, { phase: 'upload', attempt: 3, error: { code: 'network', message: '' } as never }),
    ).toEqual({ retryable: false })
  })

  test('exponential backoff escalates by attempt', () => {
    const a1 = retryDecision(config, { phase: 'upload', attempt: 1, error: { code: 'network', message: '' } as never })
    const a2 = retryDecision(config, { phase: 'upload', attempt: 2, error: { code: 'network', message: '' } as never })
    expect(a1.retryable).toBe(true)
    expect(a2.retryable).toBe(true)
    if (a1.retryable && a2.retryable) {
      expect(a2.delayMs).toBeGreaterThan(a1.delayMs ?? 0)
    }
  })
})

describe('isAbortError', () => {
  test('matches the aborted shape', () => {
    expect(isAbortError({ code: 'aborted' })).toBe(true)
    expect(isAbortError({ code: 'aborted', reason: 'pause' })).toBe(true)
  })

  test('rejects other shapes', () => {
    expect(isAbortError(null)).toBe(false)
    expect(isAbortError({})).toBe(false)
    expect(isAbortError({ code: 'http' })).toBe(false)
  })
})

describe('isMultipartIntent', () => {
  test('accepts a complete multipart intent', () => {
    expect(isMultipartIntent({ strategy: 'multipart', fileId: 'f', uploadId: 'u', partSize: 1 })).toBe(true)
  })

  test('rejects when fields are missing', () => {
    expect(isMultipartIntent({ strategy: 'multipart' })).toBe(false)
    expect(isMultipartIntent({ strategy: 'post', fileId: 'f', uploadId: 'u' })).toBe(false)
  })
})

describe('calculateFileChecksum', () => {
  test('produces a hex digest', async () => {
    const file = new File([new Uint8Array([0, 1, 2, 3])], 'a.bin')
    const h = await calculateFileChecksum(file)
    expect(h).toMatch(/^[0-9a-f]+$/)
    expect(h.length).toBeGreaterThan(0)
  })

  test('different files produce different hashes', async () => {
    const a = new File([new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 9])], 'a.bin')
    const b = new File([new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 1])], 'b.bin')
    const ha = await calculateFileChecksum(a)
    const hb = await calculateFileChecksum(b)
    expect(ha).not.toBe(hb)
  })
})
