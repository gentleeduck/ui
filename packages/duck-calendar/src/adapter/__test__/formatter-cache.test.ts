import { describe, it, expect, beforeEach } from 'vitest'
import { getCachedFormatter, clearFormatterCache } from '../formatter-cache'

beforeEach(() => {
  clearFormatterCache()
})

describe('getCachedFormatter', () => {
  it('returns an Intl.DateTimeFormat instance', () => {
    const fmt = getCachedFormatter('en-US', { year: 'numeric' })
    expect(fmt).toBeInstanceOf(Intl.DateTimeFormat)
  })

  it('returns the same cached instance for identical locale + options', () => {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
    const a = getCachedFormatter('en-US', opts)
    const b = getCachedFormatter('en-US', opts)
    expect(a).toBe(b)
  })

  it('returns the same instance regardless of option key order', () => {
    const a = getCachedFormatter('en-US', { year: 'numeric', month: 'long' })
    const b = getCachedFormatter('en-US', { month: 'long', year: 'numeric' })
    expect(a).toBe(b)
  })

  it('returns a different instance for a different locale', () => {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric' }
    const en = getCachedFormatter('en-US', opts)
    const fr = getCachedFormatter('fr-FR', opts)
    expect(en).not.toBe(fr)
  })

  it('returns a different instance for different options', () => {
    const a = getCachedFormatter('en-US', { year: 'numeric' })
    const b = getCachedFormatter('en-US', { month: 'short' })
    expect(a).not.toBe(b)
  })

  it('handles undefined locale', () => {
    const fmt = getCachedFormatter(undefined, { year: 'numeric' })
    expect(fmt).toBeInstanceOf(Intl.DateTimeFormat)
  })

  it('caches consistently when locale is undefined', () => {
    const a = getCachedFormatter(undefined, { day: '2-digit' })
    const b = getCachedFormatter(undefined, { day: '2-digit' })
    expect(a).toBe(b)
  })

  it('treats undefined locale and explicit locale as different entries', () => {
    const a = getCachedFormatter(undefined, { year: 'numeric' })
    const b = getCachedFormatter('en-US', { year: 'numeric' })
    expect(a).not.toBe(b)
  })

  it('handles empty options object', () => {
    const fmt = getCachedFormatter('en-US', {})
    expect(fmt).toBeInstanceOf(Intl.DateTimeFormat)
  })

  it('caches empty options correctly', () => {
    const a = getCachedFormatter('en-US', {})
    const b = getCachedFormatter('en-US', {})
    expect(a).toBe(b)
  })

  it('produces a formatter that actually formats dates', () => {
    const fmt = getCachedFormatter('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    const result = fmt.format(new Date(2025, 0, 15))
    expect(result).toBe('01/15/2025')
  })

  it('works with unusual but valid locales', () => {
    const fmt = getCachedFormatter('ja-JP', { era: 'long', year: 'numeric' })
    expect(fmt).toBeInstanceOf(Intl.DateTimeFormat)
    const result = fmt.format(new Date(2025, 0, 1))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('clearFormatterCache', () => {
  it('causes subsequent calls to return a new instance', () => {
    const opts: Intl.DateTimeFormatOptions = { year: 'numeric' }
    const before = getCachedFormatter('en-US', opts)
    clearFormatterCache()
    const after = getCachedFormatter('en-US', opts)
    expect(after).not.toBe(before)
  })

  it('does not throw when cache is already empty', () => {
    clearFormatterCache()
    expect(() => clearFormatterCache()).not.toThrow()
  })
})

describe('LRU eviction', () => {
  // 52 valid BCP 47 locale tags to fill and overflow the 50-entry cache
  const LOCALES = [
    'af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'cs',
    'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'eu', 'fa', 'fi',
    'fr', 'ga', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'hy', 'id',
    'is', 'it', 'ja', 'ka', 'kk', 'km', 'kn', 'ko', 'ky', 'lo',
    'lt', 'lv', 'mk', 'ml', 'mn', 'mr', 'ms', 'my', 'nb', 'ne',
    'nl', 'pl',
  ]
  const OPTS: Intl.DateTimeFormatOptions = { year: 'numeric' }

  it('evicts the least-recently-used entry when cache exceeds 50', () => {
    // Fill the cache with 50 entries
    const formatters: Intl.DateTimeFormat[] = []
    for (let i = 0; i < 50; i++) {
      formatters.push(getCachedFormatter(LOCALES[i], OPTS))
    }

    // The first entry (i=0) is the LRU. Adding one more should evict it.
    const firstFormatter = formatters[0]

    getCachedFormatter(LOCALES[50], OPTS)

    // Requesting the evicted key now should yield a brand-new instance
    const refetched = getCachedFormatter(LOCALES[0], OPTS)
    expect(refetched).not.toBe(firstFormatter)
  })

  it('preserves recently-accessed entries during eviction', () => {
    // Fill cache with 50 entries
    for (let i = 0; i < 50; i++) {
      getCachedFormatter(LOCALES[i], OPTS)
    }

    // Access the first entry to promote it (LRU touch)
    const promoted = getCachedFormatter(LOCALES[0], OPTS)

    // Insert a new entry, which should evict the second entry (LOCALES[1]) instead
    getCachedFormatter(LOCALES[50], OPTS)

    // The promoted entry should still be the same reference
    const stillCached = getCachedFormatter(LOCALES[0], OPTS)
    expect(stillCached).toBe(promoted)
  })

  it('evicts entries in insertion order when none are re-accessed', () => {
    // Fill with 50 entries
    const refs: Intl.DateTimeFormat[] = []
    for (let i = 0; i < 50; i++) {
      refs.push(getCachedFormatter(LOCALES[i], OPTS))
    }

    // Insert 2 new entries, evicting i=0 then i=1
    getCachedFormatter(LOCALES[50], OPTS)
    getCachedFormatter(LOCALES[51], OPTS)

    // First two originals should be evicted (new instances)
    expect(getCachedFormatter(LOCALES[0], OPTS)).not.toBe(refs[0])
    expect(getCachedFormatter(LOCALES[1], OPTS)).not.toBe(refs[1])

    // A later entry should still be cached
    expect(getCachedFormatter(LOCALES[49], OPTS)).toBe(refs[49])
  })
})
