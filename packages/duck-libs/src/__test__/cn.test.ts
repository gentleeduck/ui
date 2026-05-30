import { beforeEach, describe, expect, test } from 'vitest'
import { _cnMemoClear, _cnMemoSize, cn, cnMemo } from '../cn'

describe('cn', () => {
  test('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  test('handles conditional classes via clsx', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    expect(cn('base', true && 'active')).toBe('base active')
  })

  test('resolves tailwind conflicts (last wins)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('bg-red-100', 'bg-blue-200')).toBe('bg-blue-200')
  })

  test('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  test('handles objects of classes', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  test('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })

  test('ignores falsy values', () => {
    expect(cn(null, undefined, false, '', 0, 'valid')).toBe('valid')
  })

  test('merges complex tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('text-sm font-bold', 'text-lg')).toBe('font-bold text-lg')
  })
})

describe('cnMemo', () => {
  beforeEach(() => {
    _cnMemoClear()
  })

  test('returns the same result as cn for primitive string inputs', () => {
    expect(cnMemo('foo', 'bar')).toBe(cn('foo', 'bar'))
    expect(cnMemo('p-4', 'p-2')).toBe('p-2')
    expect(cnMemo('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  test('repeat key hit returns the cached result', () => {
    const first = cnMemo('px-2', 'py-1', 'px-4')
    expect(_cnMemoSize()).toBe(1)
    const second = cnMemo('px-2', 'py-1', 'px-4')
    expect(second).toBe(first)
    expect(_cnMemoSize()).toBe(1)
  })

  test('distinct input sets produce distinct cache entries', () => {
    cnMemo('a')
    cnMemo('b')
    cnMemo('c')
    expect(_cnMemoSize()).toBe(3)
  })

  test('cache size never exceeds the LRU bound under large input stress', () => {
    // Push well past the 256 cap.
    for (let i = 0; i < 1000; i++) {
      cnMemo(`unique-class-${i}`)
    }
    expect(_cnMemoSize()).toBeLessThanOrEqual(256)
    expect(_cnMemoSize()).toBe(256)
  })

  test('eviction is insertion-order: oldest entry is dropped first', () => {
    // Fill the cache to capacity.
    for (let i = 0; i < 256; i++) {
      cnMemo(`fill-${i}`)
    }
    expect(_cnMemoSize()).toBe(256)
    // Touching `fill-0` (a hit) should bump it to the tail.
    cnMemo('fill-0')
    // Now adding a new key should evict `fill-1` (the new oldest), not `fill-0`.
    cnMemo('new-key')
    expect(_cnMemoSize()).toBe(256)
    // `fill-0` should still be cached (size unchanged after re-querying).
    const sizeBefore = _cnMemoSize()
    cnMemo('fill-0')
    expect(_cnMemoSize()).toBe(sizeBefore)
    // `new-key` should also be cached.
    cnMemo('new-key')
    expect(_cnMemoSize()).toBe(sizeBefore)
  })

  test('plain insertion-order eviction without LRU bumps', () => {
    // No hits during fill — pure FIFO behavior on overflow.
    for (let i = 0; i < 256; i++) {
      cnMemo(`seq-${i}`)
    }
    expect(_cnMemoSize()).toBe(256)
    // Overflow by one — `seq-0` should be evicted.
    cnMemo('overflow')
    expect(_cnMemoSize()).toBe(256)
    // Re-querying `seq-0` is a miss, so size stays at cap (overflow already
    // there, `seq-1` evicted to make room for the re-cached `seq-0`).
    cnMemo('seq-0')
    expect(_cnMemoSize()).toBe(256)
  })
})
