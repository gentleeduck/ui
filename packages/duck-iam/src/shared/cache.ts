import type { Engine } from '../core'
/**
 * Provides an LRU (Least Recently Used) cache with TTL-based expiration.
 *
 * Used internally by the {@link Engine} to cache policies, roles, and
 * resolved subjects. Relies on `Map` insertion order for LRU eviction.
 *
 * @template V - Type of cached values.
 * @example
 * ```ts
 * const cache = new LRUCache<string>(100, 60_000)
 * cache.set('user:42', 'admin')
 * cache.get('user:42') // 'admin'
 * ```
 * @author wildduck2 <https://github.com/wildduck2>
 */
export class LRUCache<V> {
  private _map = new Map<string, { value: V; expiresAt: number }>()
  private _maxSize: number
  private _ttl: number
  private _hits = 0
  private _misses = 0

  /**
   * Constructs a new cache with the given capacity and TTL.
   *
   * @param maxSize - Sets the maximum number of entries before LRU eviction.
   * @param ttlMs - Sets time-to-live in milliseconds for each entry.
   * @throws `RangeError` when `maxSize < 1` or `ttlMs < 0`.
   * @example
   * ```ts
   * const cache = new LRUCache<Policy>(500, 30_000)
   * ```
   * @author wildduck2 <https://github.com/wildduck2>
   */
  constructor(maxSize: number, ttlMs: number) {
    if (maxSize < 1) throw new RangeError('LRUCache maxSize must be >= 1')
    if (ttlMs < 0) throw new RangeError('LRUCache ttlMs must be >= 0')
    this._maxSize = maxSize
    this._ttl = ttlMs
  }

  /**
   * Retrieves the cached value when present and not expired, otherwise `undefined`.
   * Refreshes LRU recency on hit and updates hit/miss counters.
   *
   * @param key - Looks up the entry under this cache key.
   * @returns The stored value, or `undefined` when missing or expired.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  get(key: string): V | undefined {
    const entry = this._map.get(key)
    if (!entry) {
      this._misses++
      return undefined
    }
    if (Date.now() > entry.expiresAt) {
      this._map.delete(key)
      this._misses++
      return undefined
    }
    // Move to end (most recently used)
    this._map.delete(key)
    this._map.set(key, entry)
    this._hits++
    return entry.value
  }

  /**
   * Returns hit/miss counters and current size since the last reset.
   *
   * @returns Object exposing `hits`, `misses`, and `size` fields.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  get stats(): { hits: number; misses: number; size: number } {
    return { hits: this._hits, misses: this._misses, size: this._map.size }
  }

  /**
   * Zeroes the hit and miss counters without clearing stored entries.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  resetStats(): void {
    this._hits = 0
    this._misses = 0
  }

  /**
   * Stores a value with the configured TTL. Evicts the oldest entry when at capacity.
   *
   * @param key - Stores the entry under this cache key.
   * @param value - Associates this value with the key.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  set(key: string, value: V): void {
    this._map.delete(key)
    if (this._map.size >= this._maxSize) {
      // Evict oldest
      const first = this._map.keys().next().value
      if (first !== undefined) this._map.delete(first)
    }
    this._map.set(key, { value, expiresAt: Date.now() + this._ttl })
  }

  /**
   * Removes a single entry.
   *
   * @param key - Removes the entry stored under this cache key.
   * @returns `true` when the entry existed and was deleted.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  delete(key: string): boolean {
    return this._map.delete(key)
  }

  /**
   * Removes all entries from the cache. Does not reset stat counters.
   *
   * @author wildduck2 <https://github.com/wildduck2>
   */
  clear(): void {
    this._map.clear()
  }

  /**
   * Returns the current number of entries in the cache.
   *
   * @returns Current entry count.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  get size(): number {
    return this._map.size
  }

  /**
   * Iterates over non-expired entries. Does not refresh LRU order.
   * Use for targeted invalidation, not as a primary read path.
   *
   * @returns Generator yielding `[key, value]` tuples for live entries.
   * @author wildduck2 <https://github.com/wildduck2>
   */
  *entries(): IterableIterator<[string, V]> {
    const now = Date.now()
    for (const [key, entry] of this._map) {
      if (now > entry.expiresAt) continue
      yield [key, entry.value]
    }
  }
}
