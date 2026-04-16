import { jalaaliMonthLength, toGregorian, toJalaali } from '../calendar-system'
import type { Adapter } from './adapter.types'
import { createConversionCache, formatWithCalendar } from './adapter.utils'

const persianCache = createConversionCache((date: Date) =>
  toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate()),
)

/**
 * Persian (Jalaali / Solar Hijri) date adapter.
 *
 * Uses native `Date` internally for storage but exposes year/month/day in the
 * Persian calendar. All calendar-aware methods (getYear, getMonth, getDate,
 * startOfMonth, endOfMonth, addMonths, addYears, isSameMonth, create) operate
 * in Persian calendar space.  Universal operations (addDays, isBefore, isAfter,
 * getDayOfWeek, startOfWeek, time accessors) delegate directly to Gregorian.
 */
export class PersianAdapter implements Adapter.IDateAdapter<Date> {
  private readonly locale: string

  constructor(locale = 'fa-IR') {
    this.locale = locale
  }

  /** Returns today's date with time stripped to midnight. */
  today(): Date {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  /**
   * Creates a date from Persian calendar parts.
   *
   * @param year  - Persian year (e.g. 1404)
   * @param month - **0-indexed** Persian month (0 = Farvardin, 11 = Esfand)
   * @param day   - Day of the Persian month (1-31)
   */
  create(year: number, month: number, day: number): Date {
    const { gy, gm, gd } = toGregorian(year, month + 1, day)
    return new Date(gy, gm - 1, gd)
  }

  isValid(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  /** Convert a native Date to its Jalaali parts (cached per-instance). */
  private persian(date: Date): { jy: number; jm: number; jd: number } {
    return persianCache.get(this, date)
  }

  /** Returns the Persian year for the given date. */
  getYear(date: Date): number {
    return this.persian(date).jy
  }

  /** Returns the **0-indexed** Persian month (0 = Farvardin). */
  getMonth(date: Date): number {
    return this.persian(date).jm - 1
  }

  /** Returns the day of the Persian month. */
  getDate(date: Date): number {
    return this.persian(date).jd
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  /** Compares Persian year and month. */
  isSameMonth(a: Date, b: Date): boolean {
    const ja = this.persian(a)
    const jb = this.persian(b)
    return ja.jy === jb.jy && ja.jm === jb.jm
  }

  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime()
  }

  isAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime()
  }

  /** Returns the Gregorian date corresponding to the first day of the Persian month. */
  startOfMonth(date: Date): Date {
    const { jy, jm } = this.persian(date)
    const { gy, gm, gd } = toGregorian(jy, jm, 1)
    return new Date(gy, gm - 1, gd)
  }

  /** Returns the Gregorian date corresponding to the last day of the Persian month. */
  endOfMonth(date: Date): Date {
    const { jy, jm } = this.persian(date)
    const len = jalaaliMonthLength(jy, jm)
    const { gy, gm, gd } = toGregorian(jy, jm, len)
    return new Date(gy, gm - 1, gd)
  }

  /** Walks backward to the given weekStartDay (0=Sunday). */
  startOfWeek(date: Date, weekStartDay: Adapter.WeekStartDay): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diff = (d.getDay() - weekStartDay + 7) % 7
    d.setDate(d.getDate() - diff)
    return d
  }

  addDays(date: Date, count: number): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    d.setDate(d.getDate() + count)
    return d
  }

  /** Adds Persian months with day clamping. */
  addMonths(date: Date, count: number): Date {
    const { jy, jm, jd } = this.persian(date)
    const totalMonths = jy * 12 + (jm - 1) + count
    // Use ((n % d) + d) % d to handle negative modulo correctly
    const newJy = Math.floor(totalMonths / 12)
    const newJm = (((totalMonths % 12) + 12) % 12) + 1
    const maxDay = jalaaliMonthLength(newJy, newJm)
    const newJd = Math.min(jd, maxDay)
    const { gy, gm, gd } = toGregorian(newJy, newJm, newJd)
    return new Date(gy, gm - 1, gd)
  }

  /** Adds Persian years with day clamping. */
  addYears(date: Date, count: number): Date {
    const { jy, jm, jd } = this.persian(date)
    const newJy = jy + count
    const maxDay = jalaaliMonthLength(newJy, jm)
    const newJd = Math.min(jd, maxDay)
    const { gy, gm, gd } = toGregorian(newJy, jm, newJd)
    return new Date(gy, gm - 1, gd)
  }

  getDayOfWeek(date: Date): Adapter.WeekStartDay {
    return date.getDay() as Adapter.WeekStartDay
  }

  toDate(date: Date): Date {
    return new Date(date.getTime())
  }

  fromDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  /**
   * Formats using `Intl.DateTimeFormat` with the Persian calendar extension.
   * Appends `-u-ca-persian-nu-arabext` to the locale tag for correct rendering.
   */
  format(date: Date, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return formatWithCalendar(date, options, this.locale, 'persian', locale, 'arabext')
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
