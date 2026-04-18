import { describe, expect, test } from 'vitest'
import { filteredObject } from '../filtered-object'

describe('filteredObject', () => {
  test('filters out specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(filteredObject(['b'], obj)).toEqual({ a: 1, c: 3 })
  })

  test('filters out multiple keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    expect(filteredObject(['a', 'c'], obj)).toEqual({ b: 2, d: 4 })
  })

  test('returns full object when no keys match', () => {
    const obj = { a: 1, b: 2 }
    expect(filteredObject(['x', 'y'], obj)).toEqual({ a: 1, b: 2 })
  })

  test('returns empty object when all keys are filtered', () => {
    const obj = { a: 1, b: 2 }
    expect(filteredObject(['a', 'b'], obj)).toEqual({})
  })

  test('handles empty object', () => {
    expect(filteredObject(['a'], {})).toEqual({})
  })

  test('handles empty keys array', () => {
    const obj = { a: 1, b: 2 }
    expect(filteredObject([], obj)).toEqual({ a: 1, b: 2 })
  })

  test('works with string values', () => {
    const obj = { name: 'duck', type: 'bird', color: 'yellow' }
    expect(filteredObject(['type'], obj)).toEqual({ name: 'duck', color: 'yellow' })
  })
})
