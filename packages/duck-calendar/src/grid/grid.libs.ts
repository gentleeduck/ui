import type { DateAdapter } from '../adapter'

/**
 * Returns 7 localized weekday names starting from `weekStartDay`.
 *
 * @param adapter      - Any DateAdapter instance (used only for date construction).
 * @param locale       - BCP 47 locale tag. Falls back to runtime default.
 * @param weekStartDay - The day the week starts on (0 = Sunday).
 * @param format       - Intl weekday format. Defaults to `'short'`.
 */
export function getLocalizedWeekdays<TDate>(
  adapter: DateAdapter<TDate>,
  locale: string | undefined,
  weekStartDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0,
  format: 'long' | 'short' | 'narrow' = 'short',
): string[] {
  // Use a known Sunday = Jan 5 2025 as anchor to map day indices reliably
  const KNOWN_SUNDAY = adapter.create(2025, 0, 5)

  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (weekStartDay + i) % 7
    const date = adapter.addDays(KNOWN_SUNDAY, dayIndex)
    return adapter.format(date, { weekday: format }, locale)
  })
}

/**
 * Returns 12 localized month names in calendar order (Jan–Dec).
 *
 * @param adapter - Any DateAdapter instance.
 * @param locale  - BCP 47 locale tag. Falls back to runtime default.
 * @param format  - Intl month format. Defaults to `'long'`.
 */
export function getLocalizedMonthNames<TDate>(
  adapter: DateAdapter<TDate>,
  locale: string | undefined,
  format: 'long' | 'short' | 'narrow' = 'long',
): string[] {
  return Array.from({ length: 12 }, (_, month) => {
    const date = adapter.create(2025, month, 1)
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
export function getWeekNumber<TDate>(adapter: DateAdapter<TDate>, date: TDate): number {
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
