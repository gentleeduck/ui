import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { Adapter } from './adapter.types'
import { getCachedFormatter } from './formatter-cache'

/**
 * Dayjs date adapter for `@gentleduck/calendar`.
 *
 * Wraps the `dayjs` library behind the {@link Adapter.IDateAdapter} interface so the
 * calendar engine can work with `Dayjs` instances instead of native `Date`.
 * All methods are pure  -  inputs are never mutated.
 *
 * Requires `dayjs` as a peer dependency.
 */
export class DayjsAdapter implements Adapter.IDateAdapter<Dayjs> {
  today(): Dayjs {
    return dayjs().startOf('day')
  }

  create(year: number, month: number, day: number): Dayjs {
    return dayjs(new Date(year, month, day)).startOf('day')
  }

  isValid(date: Dayjs): boolean {
    return date.isValid()
  }

  isSameDay(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'day')
  }

  isSameMonth(a: Dayjs, b: Dayjs): boolean {
    return a.isSame(b, 'month')
  }

  isBefore(a: Dayjs, b: Dayjs): boolean {
    return a.isBefore(b)
  }

  isAfter(a: Dayjs, b: Dayjs): boolean {
    return a.isAfter(b)
  }

  startOfMonth(date: Dayjs): Dayjs {
    return date.startOf('month')
  }

  /** Strips time so the boundary stays comparable with other adapters' midnight dates. */
  endOfMonth(date: Dayjs): Dayjs {
    return date.endOf('month').startOf('day')
  }

  startOfWeek(date: Dayjs, weekStartDay: Adapter.WeekStartDay): Dayjs {
    const diff = (date.day() - weekStartDay + 7) % 7
    return date.subtract(diff, 'day').startOf('day')
  }

  addDays(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'day')
  }

  addMonths(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'month')
  }

  addYears(date: Dayjs, count: number): Dayjs {
    return date.add(count, 'year')
  }

  getYear(date: Dayjs): number {
    return date.year()
  }

  getMonth(date: Dayjs): number {
    return date.month()
  }

  getDate(date: Dayjs): number {
    return date.date()
  }

  getDayOfWeek(date: Dayjs): Adapter.WeekStartDay {
    return date.day() as Adapter.WeekStartDay
  }

  toDate(date: Dayjs): Date {
    return date.toDate()
  }

  fromDate(date: Date): Dayjs {
    return dayjs(date).startOf('day')
  }

  format(date: Dayjs, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return getCachedFormatter(locale, options).format(date.toDate())
  }

  getHours(date: Dayjs): number {
    return date.hour()
  }

  getMinutes(date: Dayjs): number {
    return date.minute()
  }

  getSeconds(date: Dayjs): number {
    return date.second()
  }

  setTime(date: Dayjs, hour: number, minute: number, second?: number): Dayjs {
    return date
      .hour(hour)
      .minute(minute)
      .second(second ?? 0)
  }
}
