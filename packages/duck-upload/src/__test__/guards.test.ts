import { describe, expect, test } from 'vitest'
import { isRecord } from '../core/utils/guards'

describe('isRecord', () => {
  test('plain object', () => {
    expect(isRecord({})).toBe(true)
    expect(isRecord({ a: 1 })).toBe(true)
  })

  test('null', () => {
    expect(isRecord(null)).toBe(false)
  })

  test('undefined', () => {
    expect(isRecord(undefined)).toBe(false)
  })

  test('primitives', () => {
    expect(isRecord(0)).toBe(false)
    expect(isRecord('a')).toBe(false)
    expect(isRecord(true)).toBe(false)
  })

  // NOTE: the current implementation treats arrays as records (typeof === 'object').
  // Documented limitation: isRecord does not narrow out arrays.
  test('arrays are treated as records by the current implementation', () => {
    expect(isRecord([])).toBe(true)
    expect(isRecord([1, 2, 3])).toBe(true)
  })
})
