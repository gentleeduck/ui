import { describe, expect, it } from 'vitest'
import { buildCalendarLocaleTag, createConversionCache, formatWithCalendar } from '../adapter.utils'

describe('buildCalendarLocaleTag', () => {
  it('appends -u-ca-<calendar> to a bare locale', () => {
    expect(buildCalendarLocaleTag('en', 'gregory')).toBe('en-u-ca-gregory')
  })

  it('appends -u-ca-<calendar> to a locale with region', () => {
    expect(buildCalendarLocaleTag('en-US', 'gregory')).toBe('en-US-u-ca-gregory')
  })

  it('returns locale unchanged when it already contains the exact calendar tag', () => {
    expect(buildCalendarLocaleTag('en-u-ca-gregory', 'gregory')).toBe('en-u-ca-gregory')
  })

  it('replaces an existing -ca- tag with the new calendar', () => {
    expect(buildCalendarLocaleTag('en-u-ca-buddhist', 'gregory')).toBe('en-u-ca-gregory')
  })

  it('replaces a compound calendar subtag like islamic-civil', () => {
    expect(buildCalendarLocaleTag('ar-u-ca-islamic-civil', 'gregory')).toBe('ar-u-ca-gregory')
  })

  it('appends -ca-<calendar> when -u- already exists but no -ca-', () => {
    expect(buildCalendarLocaleTag('fa-u-nu-arabext', 'persian')).toBe('fa-u-nu-arabext-ca-persian')
  })

  it('handles locale with both -u- and -ca- already present', () => {
    expect(buildCalendarLocaleTag('fa-u-nu-arabext-ca-buddhist', 'persian')).toBe('fa-u-nu-arabext-ca-persian')
  })
})

describe('createConversionCache', () => {
  it('calls the convert function on first access', () => {
    let callCount = 0
    const cache = createConversionCache((d: Date) => {
      callCount++
      return { year: d.getFullYear() }
    })
    const instance = {}
    const date = new Date(2026, 2, 15)

    const result = cache.get(instance, date)
    expect(result).toEqual({ year: 2026 })
    expect(callCount).toBe(1)
  })

  it('returns cached value for the same date ordinal', () => {
    let callCount = 0
    const cache = createConversionCache((d: Date) => {
      callCount++
      return { year: d.getFullYear(), month: d.getMonth() }
    })
    const instance = {}
    // Two different Date objects for the same calendar day
    const date1 = new Date(2026, 2, 15, 10, 30)
    const date2 = new Date(2026, 2, 15, 14, 0)

    cache.get(instance, date1)
    const result = cache.get(instance, date2)
    expect(callCount).toBe(1)
    expect(result).toEqual({ year: 2026, month: 2 })
  })

  it('recomputes when the date changes', () => {
    let callCount = 0
    const cache = createConversionCache((d: Date) => {
      callCount++
      return d.getDate()
    })
    const instance = {}

    cache.get(instance, new Date(2026, 2, 15))
    cache.get(instance, new Date(2026, 2, 16))
    expect(callCount).toBe(2)
  })

  it('keeps separate caches per instance via WeakMap', () => {
    let callCount = 0
    const cache = createConversionCache((d: Date) => {
      callCount++
      return d.getFullYear()
    })
    const a = {}
    const b = {}
    const date = new Date(2026, 2, 15)

    cache.get(a, date)
    cache.get(b, date)
    expect(callCount).toBe(2)
  })

  it('evicts old entry when date changes on the same instance', () => {
    const results: number[] = []
    const cache = createConversionCache((d: Date) => {
      const val = d.getDate()
      results.push(val)
      return val
    })
    const instance = {}

    cache.get(instance, new Date(2026, 0, 1))
    cache.get(instance, new Date(2026, 0, 2))
    // Going back to the first date should recompute (single-slot cache)
    cache.get(instance, new Date(2026, 0, 1))
    expect(results).toEqual([1, 2, 1])
  })
})

describe('formatWithCalendar', () => {
  it('formats a date with the given calendar system', () => {
    const date = new Date(2026, 2, 15) // March 15, 2026
    const result = formatWithCalendar(date, { year: 'numeric' }, 'en-US', 'gregory')
    expect(result).toBe('2026')
  })

  it('uses the locale override when provided', () => {
    const date = new Date(2026, 2, 15)
    const result = formatWithCalendar(date, { month: 'long' }, 'en-US', 'gregory', 'fr-FR')
    // French month name for March
    expect(result.toLowerCase()).toBe('mars')
  })

  it('falls back to baseLocale when locale is not provided', () => {
    const date = new Date(2026, 2, 15)
    const result = formatWithCalendar(date, { month: 'long' }, 'en-US', 'gregory')
    expect(result).toBe('March')
  })

  it('applies a numbering system', () => {
    const date = new Date(2026, 2, 15)
    const result = formatWithCalendar(date, { day: 'numeric' }, 'en-US', 'gregory', undefined, 'arab')
    // Arabic-Indic numeral for 15 is ١٥
    expect(result).toBe('\u0661\u0665')
  })

  it('replaces an existing numbering system', () => {
    const date = new Date(2026, 2, 15)
    // Base locale already has a -nu- tag; formatWithCalendar should replace it
    const result = formatWithCalendar(date, { day: 'numeric' }, 'en-US', 'gregory', 'fa-u-nu-latn', 'arabext')
    // Should use arabext numbering (Extended Arabic-Indic)
    // The day 15 in arabext is ۱۵
    expect(result).toBe('\u06F1\u06F5')
  })

  it('does not duplicate an existing numbering system tag', () => {
    const date = new Date(2026, 2, 15)
    const result = formatWithCalendar(date, { day: 'numeric' }, 'en-US', 'gregory', 'en-u-nu-arab', 'arab')
    // Should still work correctly with arab numerals
    expect(result).toBe('\u0661\u0665')
  })

  it('formats a full date with calendar and numbering system', () => {
    const date = new Date(2026, 0, 1) // January 1, 2026
    const result = formatWithCalendar(date, { year: 'numeric', month: 'numeric', day: 'numeric' }, 'en-US', 'gregory')
    // Should produce a formatted date string containing 1/1/2026
    expect(result).toContain('1')
    expect(result).toContain('2026')
  })

  it('works with non-Gregorian calendars', () => {
    const date = new Date(2026, 2, 15) // March 15, 2026
    const result = formatWithCalendar(date, { year: 'numeric', era: 'short' }, 'en-US', 'buddhist')
    // Buddhist year for 2026 CE is 2569
    expect(result).toContain('2569')
  })
})
