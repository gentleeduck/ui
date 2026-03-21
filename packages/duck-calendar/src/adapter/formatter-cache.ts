/**
 * Shared Intl.DateTimeFormat cache to avoid re-instantiation on every format() call.
 * Bounded to MAX_SIZE entries with LRU eviction to prevent unbounded growth in long-lived SPAs.
 */
const MAX_SIZE = 50
const FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>()

/** Build a deterministic cache key using JSON.stringify with sorted keys. */
function buildKey(locale: string | undefined, options: Intl.DateTimeFormatOptions): string {
  const keys = Object.keys(options).sort()
  const sorted: Record<string, unknown> = {}
  for (const k of keys) sorted[k] = (options as Record<string, unknown>)[k]
  return `${locale ?? ''}|${JSON.stringify(sorted)}`
}

export function getCachedFormatter(
  locale: string | undefined,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = buildKey(locale, options)
  let f = FORMATTER_CACHE.get(key)
  if (f) {
    // LRU: move to end so recently-used entries are evicted last
    FORMATTER_CACHE.delete(key)
    FORMATTER_CACHE.set(key, f)
    return f
  }
  f = new Intl.DateTimeFormat(locale, options)
  if (FORMATTER_CACHE.size >= MAX_SIZE) {
    // Evict the least-recently-used entry (first key in insertion order)
    const firstKey = FORMATTER_CACHE.keys().next().value
    if (firstKey !== undefined) FORMATTER_CACHE.delete(firstKey)
  }
  FORMATTER_CACHE.set(key, f)
  return f
}

/** Clears the formatter cache. Useful when switching locales in long-lived SPAs. */
export function clearFormatterCache(): void {
  FORMATTER_CACHE.clear()
}
