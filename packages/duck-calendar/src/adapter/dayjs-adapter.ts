import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { IDateAdapter, WeekStartDay } from './adapter.types'
import { getCachedFormatter } from './formatter-cache'

/**
 * Dayjs date adapter for `@gentleduck/calendar`.
 *
 * Wraps the `dayjs` library behind the {@link IDateAdapter} interface so the
 * calendar engine can work with `Dayjs` instances instead of native `Date`.
 * All methods are pure  -  inputs are never mutated.
 *
 * Requires `dayjs` as a peer dependency.
 */
export class DayjsAdapter implements IDateAdapter<Dayjs> {
  /** Returns today's date with the time component stripped to midnight. */
  today(): Dayjs {
    return dayjs().startOf('day')
  }

  /** Creates a date from year, month (0-indexed), and day. */
  create(year: number, month: number, day: number): Dayjs {
    return dayjs(new Date(year, month, day)).startOf('day')
  }

  /** Returns `true` when the date represents a valid calendar day. */
  isValid(date: Dayjs): boolean {
    return date.isValid()
  }

  /** Returns `true` when `a` and `b` fall on the same calendar day. */
  isSameDay(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'day')
  }

  /** Returns `true` when `a` and `b` share the same year and month. */
  isSameMonth(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'month')
  }

  /** Returns `true` when `a` is strictly before `b`. */
  isBefore(a: Dayjs, b: Dayjs): boolean {
    return a.isBefore(b)
  }

  /** Returns `true` when `a` is strictly after `b`. */
  isAfter(a: Dayjs, b: Dayjs): boolean {
    return a.isAfter(b)
  }

  /** Returns the first day of the month that contains `date`. */
  startOfMonth(date: Dayjs): Dayjs {
    return date.startOf('month')
  }

  /** Returns the last day of the month that contains `date`, time stripped. */
  endOfMonth(date: Dayjs): Dayjs {
    return date.endOf('month').startOf('day')
  }

  /** Walks backward from `date` until reaching the target weekday. */
  startOfWeek(date: Dayjs, weekStartDay: WeekStartDay): Dayjs {
    const diff = (date.day() - weekStartDay + 7) % 7
    return date.subtract(diff, 'day').startOf('day')
  }

  /** Adds (or subtracts) a number of days. */
  addDays(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'day')
  }

  /** Adds (or subtracts) months with day clamping handled by dayjs. */
  addMonths(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'month')
  }

  /** Adds (or subtracts) years with day clamping handled by dayjs. */
  addYears(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'year')
  }

  /** Extracts the full four-digit year. */
  getYear(date: Dayjs): number {
    return date.year()
  }

  /** Extracts the 0-indexed month (0 = January, 11 = December). */
  getMonth(date: Dayjs): number {
    return date.month()
  }

  /** Extracts the day of the month (1-31). */
  getDate(date: Dayjs): number {
    return date.date()
  }

  /** Extracts the day of the week (0 = Sunday, 6 = Saturday). */
  getDayOfWeek(date: Dayjs): WeekStartDay {
    return date.day() as WeekStartDay
  }

  /** Converts a Dayjs instance to a native JS `Date`. */
  toDate(date: Dayjs): Date {
    return date.toDate()
  }

  /** Constructs a Dayjs instance from a native JS `Date`, stripping time. */
  fromDate(date: Date): Dayjs {
    return dayjs(date).startOf('day')
  }

  /** Formats using `Intl.DateTimeFormat`. Pass standard options like `{ month: 'long' }`. */
  format(date: Dayjs, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return getCachedFormatter(locale, options).format(date.toDate())
  }

  /** Extracts the hour (0-23). */
  getHours(date: Dayjs): number {
    return date.hour()
  }

  /** Extracts the minute (0-59). */
  getMinutes(date: Dayjs): number {
    return date.minute()
  }

  /** Extracts the second (0-59). */
  getSeconds(date: Dayjs): number {
    return date.second()
  }

  /** Returns a new date with the time set, preserving the calendar date. */
  setTime(date: Dayjs, hour: number, minute: number, second?: number): Dayjs {
    return date
      .hour(hour)
      .minute(minute)
      .second(second ?? 0)
  }
}
