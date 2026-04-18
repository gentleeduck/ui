import { describe, expect, test } from 'vitest'
import { groupArrays } from '../group-array'

describe('groupArrays', () => {
  test('groups array by specified sizes', () => {
    const result = groupArrays([2, 3], ['a', 'b', 'c', 'd', 'e'])
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd', 'e'],
    ])
  })

  test('groups with single-element groups', () => {
    const result = groupArrays([1, 1, 1], ['a', 'b', 'c'])
    expect(result).toEqual([['a'], ['b'], ['c']])
  })

  test('handles group sizes larger than remaining items', () => {
    const result = groupArrays([5], ['a', 'b'])
    expect(result).toEqual([['a', 'b']])
  })

  test('returns empty groups when array is empty', () => {
    const result = groupArrays([2, 3], [])
    expect(result).toEqual([[], []])
  })

  test('handles empty numbers array', () => {
    const result = groupArrays([], ['a', 'b', 'c'])
    expect(result).toEqual([])
  })

  test('works with number arrays', () => {
    const result = groupArrays([2, 2], [1, 2, 3, 4])
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  test('ignores leftover elements not covered by group sizes', () => {
    const result = groupArrays([2], ['a', 'b', 'c', 'd'])
    expect(result).toEqual([['a', 'b']])
  })
})
