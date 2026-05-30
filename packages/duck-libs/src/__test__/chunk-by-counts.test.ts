import { describe, expect, test } from 'vitest'
import { chunkByCounts } from '../chunk-by-counts'

describe('chunkByCounts', () => {
  test('chunks array by specified sizes', () => {
    const result = chunkByCounts(['a', 'b', 'c', 'd', 'e'], [2, 3])
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd', 'e'],
    ])
  })

  test('handles single-element groups', () => {
    const result = chunkByCounts(['a', 'b', 'c'], [1, 1, 1])
    expect(result).toEqual([['a'], ['b'], ['c']])
  })

  test('handles sizes larger than remaining items', () => {
    const result = chunkByCounts(['a', 'b'], [5])
    expect(result).toEqual([['a', 'b']])
  })

  test('returns empty groups for empty array', () => {
    const result = chunkByCounts([], [2, 3])
    expect(result).toEqual([[], []])
  })

  test('returns empty result for empty sizes', () => {
    const result = chunkByCounts(['a', 'b', 'c'], [])
    expect(result).toEqual([])
  })

  test('works with number arrays', () => {
    const result = chunkByCounts([10, 20, 30, 40], [1, 3])
    expect(result).toEqual([[10], [20, 30, 40]])
  })

  test('ignores leftover elements', () => {
    const result = chunkByCounts(['a', 'b', 'c', 'd'], [2])
    expect(result).toEqual([['a', 'b']])
  })

  test('handles zero-size groups', () => {
    const result = chunkByCounts(['a', 'b', 'c'], [0, 2])
    expect(result).toEqual([[], ['a', 'b']])
  })
})
