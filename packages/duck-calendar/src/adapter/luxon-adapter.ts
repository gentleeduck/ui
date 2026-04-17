import { DateTime } from 'luxon'
import type { Adapter } from './adapter.types'
import { getCachedFormatter } from './formatter-cache'

/**
 * Luxon date adapter wrapping `DateTime`.
 * Converts between Luxon's 1-indexed months and the adapter's 0-indexed convention.
 * All methods return new DateTime instances  -  never mutates inputs.
 */
export class LuxonAdapter implements Adapter.IDateAdapter<DateTime> {
  /** Returns today's date with time stripped to midnight. */
  today(): DateTime {
    return DateTime.now().startOf('day')
  }

  /**
   * Creates a date from year, month (0-indexed), and day.
   * Luxon uses 1-indexed months, so we add 1.
   */
  create(year: number, month: number, day: number): DateTime {
    return DateTime.local(year, month + 1, day)
  }

  /** Returns `true` when the DateTime is valid. */
  isValid(date: DateTime): boolean {
    return date.isValid
  }

  /** Returns `true` when `a` and `b` fall on the same calendar day. */
  isSameDay(a: DateTime, b: DateTime): boolean {
    return a.year === b.year && a.month === b.month && a.day === b.day
  }

  /** Returns `true` when `a` and `b` share the same year and month. */
  isSameMonth(a: DateTime, b: DateTime): boolean {
    return a.year === b.year && a.month === b.month
  }

  /** Returns `true` when `a` is strictly before `b`. */
  isBefore(a: DateTime, b: DateTime): boolean {
    return a < b
  }

  /** Returns `true` when `a` is strictly after `b`. */
  isAfter(a: DateTime, b: DateTime): boolean {
    return a > b
  }

  /** Returns the first day of the month containing `date`. */
  startOfMonth(date: DateTime): DateTime {
    return date.startOf('month')
  }

  /**
   * Returns the last day of the month containing `date`.
   * Uses `endOf('month')` then strips time to midnight.
   */
  endOfMonth(date: DateTime): DateTime {
    return date.endOf('month').startOf('day')
  }

  /**
   * Walks backward from `date` to the given weekday.
   * Luxon weekday: 1=Monday ... 7=Sunday.
   * Adapter weekStartDay: 0=Sunday ... 6=Saturday.
   */
  startOfWeek(date: DateTime, weekStartDay: Adapter.WeekStartDay): DateTime {
    // Convert Luxon weekday (1=Mon,7=Sun) to adapter format (0=Sun,6=Sat)
    const currentDay = date.weekday % 7
    const diff = (currentDay - weekStartDay + 7) % 7
    return date.minus({ days: diff }).startOf('day')
  }

  /** Adds (or subtracts) days. */
  addDays(date: DateTime, count: number): DateTime {
    return date.plus({ days: count })
  }

  /**
   * Adds months with Luxon's built-in day clamping.
   * Jan 31 + 1 month = Feb 28 (or 29 in a leap year).
   */
  addMonths(date: DateTime, count: number): DateTime {
    return date.plus({ months: count })
  }

  /**
   * Adds years with Luxon's built-in day clamping.
   * Feb 29 2024 + 1 year = Feb 28 2025.
   */
  addYears(date: DateTime, count: number): DateTime {
    return date.plus({ years: count })
  }

  /** Returns the full four-digit year. */
  getYear(date: DateTime): number {
    return date.year
  }

  /**
   * Returns the 0-indexed month (0=January, 11=December).
   * Luxon uses 1-indexed months, so we subtract 1.
   */
  getMonth(date: DateTime): number {
    return date.month - 1
  }

  /** Returns the day of the month (1-31). */
  getDate(date: DateTime): number {
    return date.day
  }

  /**
   * Returns the day of the week (0=Sunday, 6=Saturday).
   * Luxon uses 1=Monday ... 7=Sunday, so `weekday % 7` converts correctly.
   */
  getDayOfWeek(date: DateTime): Adapter.WeekStartDay {
    return (date.weekday % 7) as Adapter.WeekStartDay
  }

  /** Converts to a native JS Date. */
  toDate(date: DateTime): Date {
    return date.toJSDate()
  }

  /** Creates a DateTime from a native JS Date, stripping time to midnight. */
  fromDate(date: Date): DateTime {
    return DateTime.fromJSDate(date).startOf('day')
  }

  /** Formats using Intl.DateTimeFormat via the native JS Date. */
  format(date: DateTime, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return getCachedFormatter(locale, options).format(date.toJSDate())
  }

  /** Returns the hour (0-23). */
  getHours(date: DateTime): number {
    return date.hour
  }

  /** Returns the minute (0-59). */
  getMinutes(date: DateTime): number {
    return date.minute
  }

  /** Returns the second (0-59). */
  getSeconds(date: DateTime): number {
    return date.second
  }

  /** Returns a new DateTime with the given time, preserving the date. */
  setTime(date: DateTime, hour: number, minute: number, second?: number): DateTime {
    return date.set({ hour, minute, second: second ?? 0 })
  }
}
