import { DateTime } from 'luxon'
import type { Adapter } from './adapter.types'
import { getCachedFormatter } from './formatter-cache'

/** Backed by Luxon `DateTime`. Translates between Luxon's 1-indexed months
 * and the adapter's 0-indexed convention. See {@link Adapter.IDateAdapter}. */
export class LuxonAdapter implements Adapter.IDateAdapter<DateTime> {
  today(): DateTime {
    return DateTime.now().startOf('day')
  }

  /** Luxon uses 1-indexed months, so we add 1. */
  create(year: number, month: number, day: number): DateTime {
    return DateTime.local(year, month + 1, day)
  }

  isValid(date: DateTime): boolean {
    return date.isValid
  }

  isSameDay(a: DateTime, b: DateTime): boolean {
    return a.year === b.year && a.month === b.month && a.day === b.day
  }

  isSameMonth(a: DateTime, b: DateTime): boolean {
    return a.year === b.year && a.month === b.month
  }

  isBefore(a: DateTime, b: DateTime): boolean {
    return a < b
  }

  isAfter(a: DateTime, b: DateTime): boolean {
    return a > b
  }

  startOfMonth(date: DateTime): DateTime {
    return date.startOf('month')
  }

  /** Strips time so the boundary stays comparable with other adapters' midnight dates. */
  endOfMonth(date: DateTime): DateTime {
    return date.endOf('month').startOf('day')
  }

  /**
   * Luxon weekday: 1=Monday ... 7=Sunday.
   * Adapter weekStartDay: 0=Sunday ... 6=Saturday.
   */
  startOfWeek(date: DateTime, weekStartDay: Adapter.WeekStartDay): DateTime {
    const currentDay = date.weekday % 7
    const diff = (currentDay - weekStartDay + 7) % 7
    return date.minus({ days: diff }).startOf('day')
  }

  addDays(date: DateTime, count: number): DateTime {
    return date.plus({ days: count })
  }

  addMonths(date: DateTime, count: number): DateTime {
    return date.plus({ months: count })
  }

  addYears(date: DateTime, count: number): DateTime {
    return date.plus({ years: count })
  }

  getYear(date: DateTime): number {
    return date.year
  }

  /** Luxon months are 1-indexed; subtract 1 for the adapter's 0-indexed contract. */
  getMonth(date: DateTime): number {
    return date.month - 1
  }

  getDate(date: DateTime): number {
    return date.day
  }

  /** Luxon weekday is 1=Monday ... 7=Sunday; `% 7` maps Sunday to 0. */
  getDayOfWeek(date: DateTime): Adapter.WeekStartDay {
    return (date.weekday % 7) as Adapter.WeekStartDay
  }

  toDate(date: DateTime): Date {
    return date.toJSDate()
  }

  fromDate(date: Date): DateTime {
    return DateTime.fromJSDate(date).startOf('day')
  }

  format(date: DateTime, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return getCachedFormatter(locale, options).format(date.toJSDate())
  }

  getHours(date: DateTime): number {
    return date.hour
  }

  getMinutes(date: DateTime): number {
    return date.minute
  }

  getSeconds(date: DateTime): number {
    return date.second
  }

  setTime(date: DateTime, hour: number, minute: number, second?: number): DateTime {
    return date.set({ hour, minute, second: second ?? 0 })
  }
}
