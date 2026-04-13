import { hebrewMonthLength, hebrewMonthsInYear, hebrewToGregorian, toHebrew } from '../calendar-system/hebrew'
import type { IDateAdapter, WeekStartDay } from './adapter.types'
import { createConversionCache, formatWithCalendar } from './adapter.utils'

const hebrewCache = createConversionCache((date: Date) =>
  toHebrew(date.getFullYear(), date.getMonth() + 1, date.getDate()),
)

/**
 * Hebrew calendar adapter.
 *
 * Wraps native `Date` objects but exposes year/month/day in the Hebrew
 * calendar. The underlying `Date` still stores the Gregorian instant  -
 * conversions happen on the fly.
 *
 * - `getYear()` / `getMonth()` / `getDate()` return Hebrew values.
 * - `create(year, month, day)` takes Hebrew values (month is **0-indexed**,
 *   0 = Tishrei, 12 = Elul). In leap years, 5 = Adar I, 6 = Adar II.
 * - `format()` appends `-u-ca-hebrew` to the locale tag so that
 *   `Intl.DateTimeFormat` renders Hebrew dates.
 * - Default locale: `'he-IL'`.
 */
export class HebrewAdapter implements IDateAdapter<Date> {
  private readonly locale: string

  constructor(locale = 'he-IL') {
    this.locale = locale
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Convert a native Date to its Hebrew parts (cached per-instance). */
  private hebrew(date: Date): { hy: number; hm: number; hd: number } {
    return hebrewCache.get(this, date)
  }

  /** Build a native Date from Hebrew parts (month is 1-indexed internally). */
  private fromHebrew(hy: number, hm: number, hd: number): Date {
    const { gy, gm, gd } = hebrewToGregorian(hy, hm, hd)
    return new Date(gy, gm - 1, gd)
  }

  // ---------------------------------------------------------------------------
  // DateAdapter implementation
  // ---------------------------------------------------------------------------

  today(): Date {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  /**
   * Creates a date from Hebrew year, month (0-indexed), and day.
   *
   * @param year  - Hebrew year (e.g. 5786)
   * @param month - 0-indexed Hebrew month (0 = Tishrei, 12 = Elul)
   * @param day   - Day of the Hebrew month (1-30)
   */
  create(year: number, month: number, day: number): Date {
    return this.fromHebrew(year, month + 1, day)
  }

  isValid(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  isSameMonth(a: Date, b: Date): boolean {
    const ha = this.hebrew(a)
    const hb = this.hebrew(b)
    return ha.hy === hb.hy && ha.hm === hb.hm
  }

  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime()
  }

  isAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime()
  }

  startOfMonth(date: Date): Date {
    const { hy, hm } = this.hebrew(date)
    return this.fromHebrew(hy, hm, 1)
  }

  endOfMonth(date: Date): Date {
    const { hy, hm } = this.hebrew(date)
    return this.fromHebrew(hy, hm, hebrewMonthLength(hy, hm))
  }

  startOfWeek(date: Date, weekStartDay: WeekStartDay): Date {
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

  addMonths(date: Date, count: number): Date {
    const { hy, hm, hd } = this.hebrew(date)
    let totalMonths = hm - 1 + count
    let newYear = hy

    // Walk forward/backward through years
    if (totalMonths >= 0) {
      while (totalMonths >= hebrewMonthsInYear(newYear)) {
        totalMonths -= hebrewMonthsInYear(newYear)
        newYear++
      }
    } else {
      while (totalMonths < 0) {
        newYear--
        totalMonths += hebrewMonthsInYear(newYear)
      }
    }

    const newMonth = totalMonths + 1
    const maxDay = hebrewMonthLength(newYear, newMonth)
    return this.fromHebrew(newYear, newMonth, Math.min(hd, maxDay))
  }

  addYears(date: Date, count: number): Date {
    const { hy, hm, hd } = this.hebrew(date)
    const newYear = hy + count
    // Clamp month if moving from leap to non-leap year
    const newMonths = hebrewMonthsInYear(newYear)
    const newMonth = Math.min(hm, newMonths)
    const maxDay = hebrewMonthLength(newYear, newMonth)
    return this.fromHebrew(newYear, newMonth, Math.min(hd, maxDay))
  }

  getYear(date: Date): number {
    return this.hebrew(date).hy
  }

  getMonth(date: Date): number {
    return this.hebrew(date).hm - 1
  }

  getMonthsInYear(date: Date): number {
    return hebrewMonthsInYear(this.hebrew(date).hy)
  }

  getDate(date: Date): number {
    return this.hebrew(date).hd
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

  format(date: Date, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return formatWithCalendar(date, options, this.locale, 'hebrew', locale)
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
