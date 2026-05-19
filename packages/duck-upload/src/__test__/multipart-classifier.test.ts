import { describe, expect, test } from 'vitest'
import { isTransientNetworkFailure } from '../strategies/multipart'

describe('isTransientNetworkFailure', () => {
  test('classifies code === "network" as retryable regardless of status', () => {
    expect(isTransientNetworkFailure({ code: 'network', status: 0 })).toBe(true)
    expect(isTransientNetworkFailure({ code: 'network' })).toBe(true)
  })

  test('classifies HTTP 5xx as retryable', () => {
    expect(isTransientNetworkFailure({ status: 500 })).toBe(true)
    expect(isTransientNetworkFailure({ status: 502 })).toBe(true)
    expect(isTransientNetworkFailure({ status: 503 })).toBe(true)
  })

  test('classifies HTTP 429 as retryable', () => {
    expect(isTransientNetworkFailure({ status: 429 })).toBe(true)
    expect(isTransientNetworkFailure({ statusCode: 429 })).toBe(true)
  })

  test('classifies HTTP 4xx (except 429) as final', () => {
    expect(isTransientNetworkFailure({ status: 400 })).toBe(false)
    expect(isTransientNetworkFailure({ status: 403 })).toBe(false)
    expect(isTransientNetworkFailure({ status: 404 })).toBe(false)
  })

  test('rejects non-network non-HTTP throws', () => {
    expect(isTransientNetworkFailure(new Error('random'))).toBe(false)
    expect(isTransientNetworkFailure(null)).toBe(false)
    expect(isTransientNetworkFailure(undefined)).toBe(false)
    expect(isTransientNetworkFailure('string')).toBe(false)
    expect(isTransientNetworkFailure({})).toBe(false)
  })

  test('does NOT match by message regex', () => {
    // Structural classifier rejects message sniffing. A plain error
    // mentioning "500" or "network" must NOT be classified as retryable
    // without a structured status field.
    expect(isTransientNetworkFailure(new Error('500-pixel image failed'))).toBe(false)
    expect(isTransientNetworkFailure(new Error('please fetch from the network drive'))).toBe(false)
  })
})
