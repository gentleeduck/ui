import type { Adapter } from '../adapter'

/**
 * Returns 7 localized weekday names starting from `weekStartDay`.
 *
 * @param adapter      - Any DateAdapter instance (used only for date construction).
 * @param locale       - BCP 47 locale tag. Falls back to runtime default.
 * @param weekStartDay - The day the week starts on (0 = Sunday).
 * @param format       - Intl weekday format. Defaults to `'short'`.
 */
export function getLocalizedWeekdays<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  locale: string | undefined,
  weekStartDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0,
  format: 'long' | 'short' | 'narrow' = 'short',
): string[] {
  // Use a known Gregorian Sunday (Jan 5 2025) via fromDate to avoid calendar-system issues
  const KNOWN_SUNDAY = adapter.fromDate(new Date(2025, 0, 5))

  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (weekStartDay + i) % 7
    const date = adapter.addDays(KNOWN_SUNDAY, dayIndex)
    return adapter.format(date, { weekday: format }, locale)
  })
}

/**
 * Returns localized month names for the given year.
 *
 * Queries the adapter for the actual month count via `getMonthsInYear()`
 * to support calendar systems with variable months (e.g. Hebrew leap years
 * with 13 months). Falls back to 12 for adapters that don't implement it.
 *
 * @param adapter - Any DateAdapter instance.
 * @param year    - The year to query month count for.
 * @param locale  - BCP 47 locale tag. Falls back to runtime default.
 * @param format  - Intl month format. Defaults to `'long'`.
 */
export function getLocalizedMonthNames<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  year: number,
  locale: string | undefined,
  format: 'long' | 'short' | 'narrow' = 'long',
): string[] {
  const probe = adapter.create(year, 0, 1)
  const monthCount = adapter.getMonthsInYear?.(probe) ?? 12

  return Array.from({ length: monthCount }, (_, month) => {
    const date = adapter.create(year, month, 1)
    return adapter.format(date, { month: format }, locale)
  })
}

/**
 * Computes the ISO 8601 week number for a given date.
 * Week 1 is the week containing the first Thursday of the year.
 *
 * @param adapter - Any DateAdapter instance.
 * @param date    - The date to compute the week number for.
 */
export function getWeekNumber<TDate>(adapter: Adapter.IDateAdapter<TDate>, date: TDate): number {
  // ISO week: week containing Thursday; weeks start on Monday
  const native = adapter.toDate(date)

  // Copy and strip time
  const d = new Date(native.getFullYear(), native.getMonth(), native.getDate())

  // Set to nearest Thursday: current date + 4 - current ISO day
  // ISO day: Mon=1 ... Sun=7
  const isoDay = d.getDay() === 0 ? 7 : d.getDay()
  d.setDate(d.getDate() + 4 - isoDay)

  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
}
