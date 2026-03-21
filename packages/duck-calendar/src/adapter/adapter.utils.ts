import { getCachedFormatter } from './formatter-cache'

/** Fast day-level comparison without allocating Date objects. */
function dateToOrdinal(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

/**
 * Builds an Intl locale tag with the specified calendar extension.
 * Handles replacing existing `-ca-` tags or appending `-u-ca-<calendar>`.
 */
export function buildCalendarLocaleTag(locale: string, calendar: string): string {
  const calTag = `-ca-${calendar}`
  if (locale.includes(calTag)) return locale
  if (locale.includes('-ca-')) {
    // Match -ca-<value> segments. Calendar subtags (e.g. islamic-civil) have 3+ char
    // segments; Unicode extension keys are exactly 2 chars. Stop before the next key.
    return locale.replace(/-ca-[a-z]+(?:-[a-z]{3,})*/, calTag)
  }
  if (locale.includes('-u-')) {
    return `${locale}${calTag}`
  }
  return `${locale}-u-ca-${calendar}`
}

/**
 * Creates a stateless single-slot cache for Gregorian-to-calendar conversions.
 * Keyed by ordinal, so sequential calls to getYear/getMonth/getDate on the
 * same date hit the cache. The cache is per-adapter-instance (via WeakMap),
 * making it safe for concurrent React renders.
 */
export function createConversionCache<T>(convert: (date: Date) => T): {
  get(instance: object, date: Date): T
} {
  const map = new WeakMap<object, { ord: number; parts: T }>()
  return {
    get(instance: object, date: Date): T {
      const ord = dateToOrdinal(date)
      const cached = map.get(instance)
      if (cached && cached.ord === ord) return cached.parts
      const parts = convert(date)
      map.set(instance, { ord, parts })
      return parts
    },
  }
}

/**
 * Formats a date using Intl.DateTimeFormat with a specific calendar system.
 * Handles locale tag construction and formatter caching.
 *
 * @param numberingSystem - Optional Unicode numbering system (e.g. 'arabext' for Persian).
 *   Appends `-nu-<value>` to the locale tag if not already present.
 */
export function formatWithCalendar(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  baseLocale: string,
  calendar: string,
  locale?: string,
  numberingSystem?: string,
): string {
  const loc = locale ?? baseLocale
  let tag = buildCalendarLocaleTag(loc, calendar)
  if (numberingSystem) {
    const nuTag = `-nu-${numberingSystem}`
    if (!tag.includes(nuTag)) {
      if (tag.includes('-nu-')) {
        tag = tag.replace(/-nu-[a-z]+(?:-[a-z]{3,})*/, nuTag)
      } else {
        tag = `${tag}${nuTag}`
      }
    }
  }
  return getCachedFormatter(tag, options).format(date)
}
