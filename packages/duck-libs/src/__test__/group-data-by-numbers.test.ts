import { describe, expect, test } from 'vitest'
import { groupDataByNumbers } from '../group-data-by-numbers'

describe('groupDataByNumbers', () => {
  test('groups strings by specified sizes', () => {
    const result = groupDataByNumbers(['a', 'b', 'c', 'd', 'e'], [2, 3])
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd', 'e'],
    ])
  })

  test('handles group size larger than remaining items', () => {
    const result = groupDataByNumbers(['a', 'b'], [5])
    expect(result).toEqual([['a', 'b']])
  })

  test('returns empty groups for empty input', () => {
    const result = groupDataByNumbers([], [2, 3])
    expect(result).toEqual([[], []])
  })

  test('handles empty group sizes', () => {
    const result = groupDataByNumbers(['a', 'b'], [])
    expect(result).toEqual([])
  })

  test('groups with single-element groups', () => {
    const result = groupDataByNumbers(['x', 'y', 'z'], [1, 1, 1])
    expect(result).toEqual([['x'], ['y'], ['z']])
  })

  test('works with number arrays', () => {
    const result = groupDataByNumbers([10, 20, 30, 40], [1, 3])
    expect(result).toEqual([[10], [20, 30, 40]])
  })

  test('ignores leftover elements', () => {
    const result = groupDataByNumbers(['a', 'b', 'c', 'd'], [2])
    expect(result).toEqual([['a', 'b']])
  })

  test('handles zero-size groups', () => {
    const result = groupDataByNumbers(['a', 'b', 'c'], [0, 2])
    expect(result).toEqual([[], ['a', 'b']])
  })
})
