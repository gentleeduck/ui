/**
 * Pure math functions for Gregorian <-> Hebrew calendar conversion.
 *
 * Based on the Reingold/Dershowitz algorithm from "Calendrical Calculations".
 * Uses the fixed arithmetic Hebrew calendar with postponement rules (dehiyot).
 *
 * Hebrew epoch: Monday, October 7, 3761 BCE (proleptic Gregorian) = 1 Tishrei, Year 1.
 *
 * Months (1-indexed):
 *  1 Tishrei (30), 2 Cheshvan (29-30), 3 Kislev (29-30), 4 Tevet (29),
 *  5 Shevat (30), 6 Adar/Adar I (30 in leap), 7 Adar II (29, leap only),
 *  8 Nisan (30), 9 Iyar (29), 10 Sivan (30), 11 Tammuz (29),
 *  12 Av (30), 13 Elul (29)
 *
 * In a common year: 12 months (no Adar II; month 6 = Adar, 29 days).
 * In a leap year: 13 months (month 6 = Adar I 30 days, month 7 = Adar II 29 days).
 *
 * @module
 */

import { gregorianMonthLength, isGregorianLeap } from './gregorian'

/** Leap years within the 19-year Metonic cycle. */
const LEAP_CYCLE = [3, 6, 8, 11, 14, 17, 19]

/**
 * Hebrew month names (1-indexed by position).
 */
export const HEBREW_MONTHS = [
  'Tishrei',
  'Cheshvan',
  'Kislev',
  'Tevet',
  'Shevat',
  'Adar',
  'Adar II',
  'Nisan',
  'Iyar',
  'Sivan',
  'Tammuz',
  'Av',
  'Elul',
]

/**
 * Check if a Hebrew year is a leap year (has 13 months).
 */
export function isLeapHebrewYear(hy: number): boolean {
  return LEAP_CYCLE.includes(((hy - 1) % 19) + 1)
}

/**
 * Number of months in a Hebrew year.
 */
export function hebrewMonthsInYear(hy: number): number {
  return isLeapHebrewYear(hy) ? 13 : 12
}

/**
 * Compute the number of elapsed days from the Hebrew epoch to 1 Tishrei of year `hy`.
 * Uses the classic molad-based computation with postponement rules.
 */
function hebrewElapsedDays(hy: number): number {
  // Months elapsed before this year
  const monthsElapsed = Math.floor((235 * hy - 234) / 19)

  // Compute the molad (new moon) in parts (1 hour = 1080 parts)
  const partsElapsed = 12084 + 13753 * monthsElapsed
  const day = 1 + 29 * monthsElapsed + Math.floor(partsElapsed / 25920)
  const remainingParts = partsElapsed % 25920

  // Apply dehiyot (postponement rules)
  const dayOfWeek = day % 7

  // Dehiyah 1: Lo ADU Rosh  -  if day is Sun(0), Wed(3), or Fri(5), postpone by 1
  if (dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5) {
    return day + 1
  }

  // Dehiyah 2: Molad Zaken  -  if molad is >= 18 hours (=19440 parts), postpone
  if (remainingParts >= 19440) {
    const next = day + 1
    const nextDow = next % 7
    return nextDow === 0 || nextDow === 3 || nextDow === 5 ? next + 1 : next
  }

  // Dehiyah 3: In a non-leap year, if molad of Tishrei falls on Tuesday
  // at or after 9h 204p, postpone to Thursday
  if (dayOfWeek === 2 && remainingParts >= 9924 && !isLeapHebrewYear(hy)) {
    return day + 2
  }

  // Dehiyah 4: In the year after a leap year, if molad of Tishrei falls on Monday
  // at or after 15h 589p, postpone to Tuesday
  if (dayOfWeek === 1 && remainingParts >= 16789 && isLeapHebrewYear(hy - 1)) {
    return day + 1
  }

  return day
}

/**
 * Get the total number of days in a Hebrew year.
 */
export function hebrewYearLength(hy: number): number {
  return hebrewElapsedDays(hy + 1) - hebrewElapsedDays(hy)
}

/**
 * Get the number of days in a Hebrew month.
 *
 * @param hy - Hebrew year
 * @param hm - Hebrew month (1-indexed, 1 = Tishrei, 13 = Elul)
 */
export function hebrewMonthLength(hy: number, hm: number): number {
  const months = hebrewMonthsInYear(hy)
  if (hm < 1 || hm > months) return 0

  const yearLen = hebrewYearLength(hy)

  // In leap years: 1=Tishrei..6=Adar I, 7=Adar II, 8=Nisan..13=Elul
  // In common years: 1=Tishrei..6=Adar, 7=Nisan..12=Elul (no Adar II)
  const leap = isLeapHebrewYear(hy)

  if (hm === 1) return 30 // Tishrei
  if (hm === 2) return yearLen % 10 === 5 ? 30 : 29 // Cheshvan
  if (hm === 3) return yearLen % 10 === 3 ? 29 : 30 // Kislev
  if (hm === 4) return 29 // Tevet
  if (hm === 5) return 30 // Shevat

  if (leap) {
    // Leap year: 6=Adar I (30), 7=Adar II (29), 8-13=Nisan-Elul
    if (hm === 6) return 30
    if (hm === 7) return 29
    // Nisan(8)=30, Iyar(9)=29, Sivan(10)=30, Tammuz(11)=29, Av(12)=30, Elul(13)=29
    return hm % 2 === 0 ? 30 : 29
  }
  // Common year: 6=Adar (29), 7-12=Nisan-Elul
  if (hm === 6) return 29
  // Nisan(7)=30, Iyar(8)=29, Sivan(9)=30, Tammuz(10)=29, Av(11)=30, Elul(12)=29
  return hm % 2 === 1 ? 30 : 29
}

/** R.D. date of Hebrew epoch (1 Tishrei, year 1). */
const HEBREW_EPOCH = -1373428

/** Convert Gregorian to R.D. (rata die) fixed day number. */
function gregorianToFixed(gy: number, gm: number, gd: number): number {
  const y = gy - 1
  return (
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) +
    Math.floor((367 * gm - 362) / 12) +
    (gm <= 2 ? 0 : isGregorianLeap(gy) ? -1 : -2) +
    gd
  )
}

/** Convert R.D. fixed day to Gregorian date. */
function fixedToGregorian(rd: number): { gy: number; gm: number; gd: number } {
  const d0 = rd - 1
  const n400 = Math.floor(d0 / 146097)
  const d1 = ((d0 % 146097) + 146097) % 146097
  const n100 = Math.floor(d1 / 36524)
  const d2 = ((d1 % 36524) + 36524) % 36524
  const n4 = Math.floor(d2 / 1461)
  const d3 = ((d2 % 1461) + 1461) % 1461
  const n1 = Math.floor(d3 / 365)
  const gy = 400 * n400 + 100 * n100 + 4 * n4 + n1 + (n100 === 4 || n1 === 4 ? 0 : 1)
  const jan1 = gregorianToFixed(gy, 1, 1)
  const priorDays = rd - jan1
  const correction = rd < gregorianToFixed(gy, 3, 1) ? 0 : isGregorianLeap(gy) ? 1 : 2
  const gm = Math.floor((12 * (priorDays + correction) + 373) / 367)
  const gd = rd - gregorianToFixed(gy, gm, 1) + 1
  return { gy, gm, gd }
}

/** R.D. of 1 Tishrei of Hebrew year `hy`. */
function hebrewNewYear(hy: number): number {
  return HEBREW_EPOCH + hebrewElapsedDays(hy)
}

/**
 * Convert a Gregorian date to a Hebrew date.
 *
 * @param gy - Gregorian year
 * @param gm - Gregorian month (1-indexed, 1 = January)
 * @param gd - Gregorian day
 * @returns Hebrew year, month (1-indexed), and day
 */
export function toHebrew(gy: number, gm: number, gd: number): { hy: number; hm: number; hd: number } {
  if (gm < 1 || gm > 12 || gd < 1 || gd > gregorianMonthLength(gy, gm)) {
    throw new RangeError(`Invalid Gregorian date: ${gy}-${gm}-${gd}`)
  }
  const rd = gregorianToFixed(gy, gm, gd)
  // Approximate Hebrew year (Tishrei falls in Sep/Oct, so before that we're still in the previous Hebrew year)
  let hy = gy + 3761

  // Search downward - the approximation can overshoot.
  // The offset is at most 1 year, but we allow a generous bound and throw if exhausted.
  let i: number
  for (i = 0; i < 100 && hebrewNewYear(hy) > rd; i++) hy--
  if (i === 100) throw new RangeError(`Hebrew year search failed for Gregorian date: ${gy}-${gm}-${gd}`)
  // Then search upward to find the correct year
  for (i = 0; i < 100 && hebrewNewYear(hy + 1) <= rd; i++) hy++
  if (i === 100) throw new RangeError(`Hebrew year search failed for Gregorian date: ${gy}-${gm}-${gd}`)

  // Find month - use <= so the last month (Elul) is reachable
  let hm = 1
  let remaining = rd - hebrewNewYear(hy) + 1
  const months = hebrewMonthsInYear(hy)
  while (hm <= months) {
    const ml = hebrewMonthLength(hy, hm)
    if (remaining <= ml) break
    remaining -= ml
    hm++
  }
  return { hy, hm, hd: remaining }
}

/**
 * Convert a Hebrew date to a Gregorian date.
 *
 * @param hy - Hebrew year
 * @param hm - Hebrew month (1-indexed, 1 = Tishrei)
 * @param hd - Hebrew day
 * @returns Gregorian year, month (1-indexed), and day
 */
export function hebrewToGregorian(hy: number, hm: number, hd: number): { gy: number; gm: number; gd: number } {
  const months = hebrewMonthsInYear(hy)
  if (hm < 1 || hm > months || hd < 1 || hd > hebrewMonthLength(hy, hm)) {
    throw new RangeError(`Invalid Hebrew date: ${hy}-${hm}-${hd}`)
  }
  let rd = hebrewNewYear(hy)
  for (let m = 1; m < hm; m++) {
    rd += hebrewMonthLength(hy, m)
  }
  rd += hd - 1
  return fixedToGregorian(rd)
}
