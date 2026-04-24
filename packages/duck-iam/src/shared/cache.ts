/**
 * A simple LRU (Least Recently Used) cache with TTL-based expiration.
 *
 * Used internally by the {@link Engine} to cache policies, roles, and
 * resolved subjects. Leverages `Map` insertion order for LRU eviction.
 *
 * @template V - The type of cached values
 */
export class LRUCache<V> {
  private map = new Map<string, { value: V; expiresAt: number }>()
  private maxSize: number
  private ttl: number

  /**
   * @param maxSize - Maximum number of entries before LRU eviction
   * @param ttlMs   - Time-to-live in milliseconds for each entry
   */
  constructor(maxSize: number, ttlMs: number) {
    if (maxSize < 1) throw new RangeError('LRUCache maxSize must be >= 1')
    if (ttlMs < 0) throw new RangeError('LRUCache ttlMs must be >= 0')
    this.maxSize = maxSize
    this.ttl = ttlMs
  }

  /** Returns the cached value if present and not expired, otherwise `undefined`. */
  get(key: string): V | undefined {
    const entry = this.map.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key)
      return undefined
    }
    // Move to end (most recently used)
    this.map.delete(key)
    this.map.set(key, entry)
    return entry.value
  }

  /** Stores a value with the configured TTL. Evicts the oldest entry if at capacity. */
  set(key: string, value: V): void {
    this.map.delete(key)
    if (this.map.size >= this.maxSize) {
      // Evict oldest
      const first = this.map.keys().next().value
      if (first !== undefined) this.map.delete(first)
    }
    this.map.set(key, { value, expiresAt: Date.now() + this.ttl })
  }

  /** Removes a single entry. Returns `true` if the entry existed. */
  delete(key: string): boolean {
    return this.map.delete(key)
  }

  /** Removes all entries from the cache. */
  clear(): void {
    this.map.clear()
  }

  /** The current number of entries in the cache. */
  get size(): number {
    return this.map.size
  }
}
