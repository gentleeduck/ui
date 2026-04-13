import { hijriMonthLength, toGregorian, toHijri } from '../calendar-system/hijri'
import type { IDateAdapter, WeekStartDay } from './adapter.types'
import { createConversionCache, formatWithCalendar } from './adapter.utils'

const hijriCache = createConversionCache((date: Date) =>
  toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate()),
)

/**
 * Islamic (Hijri) calendar adapter.
 *
 * Wraps native `Date` objects but exposes year/month/day in the tabular
 * Islamic calendar. The underlying `Date` still stores the Gregorian
 * instant  -  conversions happen on the fly.
 *
 * - `getYear()` / `getMonth()` / `getDate()` return Hijri values.
 * - `create(year, month, day)` takes Hijri values (month is **0-indexed**,
 *   0 = Muharram, 11 = Dhu al-Hijjah).
 * - `format()` appends `-u-ca-islamic` to the locale tag so that
 *   `Intl.DateTimeFormat` renders Islamic dates.
 * - Default locale: `'ar-SA'`.
 */
export class IslamicAdapter implements IDateAdapter<Date> {
  private readonly locale: string

  constructor(locale = 'ar-SA') {
    this.locale = locale
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Convert a native Date to its Hijri parts (cached per-instance). */
  private hijri(date: Date): { hy: number; hm: number; hd: number } {
    return hijriCache.get(this, date)
  }

  /** Build a native Date from Hijri parts (month is 1-indexed internally). */
  private fromHijri(hy: number, hm: number, hd: number): Date {
    const { gy, gm, gd } = toGregorian(hy, hm, hd)
    return new Date(gy, gm - 1, gd)
  }

  // ---------------------------------------------------------------------------
  // DateAdapter implementation
  // ---------------------------------------------------------------------------

  /** Returns today's date with time stripped to midnight. */
  today(): Date {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }

  /**
   * Creates a date from Hijri year, month (0-indexed), and day.
   *
   * @param year  - Hijri year (e.g. 1447)
   * @param month - 0-indexed Hijri month (0 = Muharram, 11 = Dhu al-Hijjah)
   * @param day   - Day of the Hijri month (1-30)
   */
  create(year: number, month: number, day: number): Date {
    // month is 0-indexed externally, 1-indexed internally
    return this.fromHijri(year, month + 1, day)
  }

  isValid(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  isSameMonth(a: Date, b: Date): boolean {
    const ha = this.hijri(a)
    const hb = this.hijri(b)
    return ha.hy === hb.hy && ha.hm === hb.hm
  }

  isBefore(a: Date, b: Date): boolean {
    return a.getTime() < b.getTime()
  }

  isAfter(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime()
  }

  /** Returns the first day of the Hijri month containing `date`. */
  startOfMonth(date: Date): Date {
    const { hy, hm } = this.hijri(date)
    return this.fromHijri(hy, hm, 1)
  }

  /** Returns the last day of the Hijri month containing `date`. */
  endOfMonth(date: Date): Date {
    const { hy, hm } = this.hijri(date)
    return this.fromHijri(hy, hm, hijriMonthLength(hy, hm))
  }

  /** Walks backward to the given weekStartDay (0=Sunday). */
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

  /**
   * Adds months in the Hijri calendar with day clamping.
   *
   * @example adapter.addMonths(date, 1) // next Hijri month
   */
  addMonths(date: Date, count: number): Date {
    const { hy, hm, hd } = this.hijri(date)
    // Total 0-indexed months, then add
    const totalMonths = (hy - 1) * 12 + (hm - 1) + count
    const newYear = Math.floor(totalMonths / 12) + 1
    // Use ((n % d) + d) % d to handle negative modulo correctly
    const newMonth = (((totalMonths % 12) + 12) % 12) + 1
    const maxDay = hijriMonthLength(newYear, newMonth)
    return this.fromHijri(newYear, newMonth, Math.min(hd, maxDay))
  }

  /**
   * Adds years in the Hijri calendar with day clamping.
   *
   * Dhu al-Hijjah 30 in a leap year -> clamped to 29 in a non-leap year.
   */
  addYears(date: Date, count: number): Date {
    const { hy, hm, hd } = this.hijri(date)
    const newYear = hy + count
    const maxDay = hijriMonthLength(newYear, hm)
    return this.fromHijri(newYear, hm, Math.min(hd, maxDay))
  }

  /** Returns the Hijri year. */
  getYear(date: Date): number {
    return this.hijri(date).hy
  }

  /** Returns the 0-indexed Hijri month (0 = Muharram). */
  getMonth(date: Date): number {
    return this.hijri(date).hm - 1
  }

  /** Returns the Hijri day of the month. */
  getDate(date: Date): number {
    return this.hijri(date).hd
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

  /**
   * Formats using `Intl.DateTimeFormat` with the Islamic calendar extension.
   *
   * Appends `-u-ca-islamic` to the locale tag so the formatter renders
   * Islamic month names and year numbering.
   */
  format(date: Date, options: Intl.DateTimeFormatOptions, locale?: string): string {
    return formatWithCalendar(date, options, this.locale, 'islamic', locale)
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
