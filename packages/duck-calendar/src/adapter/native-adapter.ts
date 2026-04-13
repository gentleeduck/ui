import type { IDateAdapter, WeekStartDay } from './adapter.types'
import { getCachedFormatter } from './formatter-cache'

/**
 * Native date adapter using built-in `Date` and `Intl.DateTimeFormat`.
 * Zero external dependencies. Handles month-overflow clamping (Jan 31 + 1 month = Feb 28).
 * All methods return new Date instances  -  never mutates inputs.
 */
export class NativeAdapter implements IDateAdapter<Date> {
  /** Returns today's date with time stripped to midnight. */
  today(): Date {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  /** Creates a date from year, month (0-indexed), and day. */
  create(year: number, month: number, day: number): Date {
    return new Date(year, month, day)
  }

  isValid(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  }

  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime()
  }

  isAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime()
  }

  startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  endOfMonth(date: Date): Date {
    // day 0 of next month = last day of current month
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  /** Walks backward to the given weekStartDay (0=Sunday). */
  startOfWeek(date: Date, weekStartDay: WeekStartDay): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diff = (d.getDay() - weekStartDay + 7) % 7
    d.setDate(d.getDate() - diff)
    return d
  }

  addDays(date: Date, count: number): Date {
    const d = new Date(date.getTime())
    d.setDate(d.getDate() + count)
    return d
  }

  /** Adds months with day clamping  -  Jan 31 + 1 = Feb 28, not Mar 3. Preserves time. */
  addMonths(date: Date, count: number): Date {
    const d = new Date(date.getTime())
    const originalDay = d.getDate()
    d.setDate(1)
    d.setMonth(d.getMonth() + count)
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    d.setDate(Math.min(originalDay, lastDay))
    return d
  }

  /** Adds years with day clamping  -  Feb 29 2024 + 1 = Feb 28 2025. Preserves time. */
  addYears(date: Date, count: number): Date {
    const d = new Date(date.getTime())
    const originalDay = d.getDate()
    d.setDate(1)
    d.setFullYear(d.getFullYear() + count)
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    d.setDate(Math.min(originalDay, lastDay))
    return d
  }

  getYear(date: Date): number {
    return date.getFullYear()
  }

  getMonth(date: Date): number {
    return date.getMonth()
  }

  getDate(date: Date): number {
    return date.getDate()
  }

  getDayOfWeek(date: Date): WeekStartDay {
    return date.getDay() as WeekStartDay
  }

  toDate(date: Date): Date {
    return new Date(date.getTime())
  }

  fromDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  /** Formats using Intl.DateTimeFormat with cached formatter instances. */
  format(date: Date, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return getCachedFormatter(locale, options).format(date)
  }

  getHours(date: Date): number {
    return date.getHours()
  }

  getMinutes(date: Date): number {
    return date.getMinutes()
  }

  getSeconds(date: Date): number {
    return date.getSeconds()
  }

  setTime(date: Date, hour: number, minute: number, second?: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, second ?? 0)
  }
}
