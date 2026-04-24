import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LRUCache } from '../cache'

describe('LRUCache', () => {
  it('stores and retrieves values', () => {
    const cache = new LRUCache<string>(10, 60000)
    cache.set('key1', 'value1')
    expect(cache.get('key1')).toBe('value1')
  })

  it('returns undefined for missing keys', () => {
    const cache = new LRUCache<string>(10, 60000)
    expect(cache.get('missing')).toBeUndefined()
  })

  it('tracks size correctly', () => {
    const cache = new LRUCache<number>(10, 60000)
    expect(cache.size).toBe(0)
    cache.set('a', 1)
    cache.set('b', 2)
    expect(cache.size).toBe(2)
  })

  it('evicts oldest entry when at max size', () => {
    const cache = new LRUCache<string>(2, 60000)
    cache.set('a', '1')
    cache.set('b', '2')
    cache.set('c', '3') // should evict 'a'
    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe('2')
    expect(cache.get('c')).toBe('3')
    expect(cache.size).toBe(2)
  })

  it('get() promotes entry to most recently used', () => {
    const cache = new LRUCache<string>(2, 60000)
    cache.set('a', '1')
    cache.set('b', '2')
    cache.get('a') // promote 'a'
    cache.set('c', '3') // should evict 'b' (least recently used)
    expect(cache.get('a')).toBe('1')
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('c')).toBe('3')
  })

  it('delete() removes an entry', () => {
    const cache = new LRUCache<string>(10, 60000)
    cache.set('a', '1')
    expect(cache.delete('a')).toBe(true)
    expect(cache.get('a')).toBeUndefined()
    expect(cache.size).toBe(0)
  })

  it('delete() returns false for missing key', () => {
    const cache = new LRUCache<string>(10, 60000)
    expect(cache.delete('missing')).toBe(false)
  })

  it('clear() removes all entries', () => {
    const cache = new LRUCache<string>(10, 60000)
    cache.set('a', '1')
    cache.set('b', '2')
    cache.clear()
    expect(cache.size).toBe(0)
    expect(cache.get('a')).toBeUndefined()
  })

  it('overwrites existing key without increasing size', () => {
    const cache = new LRUCache<string>(10, 60000)
    cache.set('a', '1')
    cache.set('a', '2')
    expect(cache.size).toBe(1)
    expect(cache.get('a')).toBe('2')
  })

  it('rejects negative maxSize', () => {
    expect(() => new LRUCache<string>(0, 1000)).toThrow(RangeError)
    expect(() => new LRUCache<string>(-1, 1000)).toThrow(RangeError)
  })

  it('rejects negative ttlMs', () => {
    expect(() => new LRUCache<string>(10, -1)).toThrow(RangeError)
  })

  it('allows ttlMs of 0 without throwing', () => {
    expect(() => new LRUCache<string>(10, 0)).not.toThrow()
  })

  it('evicts in correct LRU order with more than 2 entries', () => {
    const cache = new LRUCache<string>(3, 60000)
    cache.set('a', '1')
    cache.set('b', '2')
    cache.set('c', '3')
    cache.get('a') // promote 'a'
    cache.set('d', '4') // should evict 'b' (least recently used)
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('a')).toBe('1')
    expect(cache.get('c')).toBe('3')
    expect(cache.get('d')).toBe('4')
  })

  describe('TTL expiration', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns undefined for expired entries', () => {
      const cache = new LRUCache<string>(10, 100) // 100ms TTL
      cache.set('a', '1')
      expect(cache.get('a')).toBe('1')

      vi.advanceTimersByTime(150)
      expect(cache.get('a')).toBeUndefined()
    })

    it('removes expired entries on get', () => {
      const cache = new LRUCache<string>(10, 100)
      cache.set('a', '1')
      vi.advanceTimersByTime(150)
      cache.get('a') // triggers cleanup
      // Size may still show 0 since the entry was removed
      expect(cache.get('a')).toBeUndefined()
    })
  })
})
