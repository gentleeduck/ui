import { describe, expect, it } from 'vitest'

import { HebrewAdapter, IslamicAdapter, PersianAdapter } from '../../adapter'
import { buildCalendarMonth, buildCalendarYear, buildMultiMonth } from '../../grid'
import type { Selection } from '../../selection'
import { applySelection, selectDay } from '../../selection'
import {
  hebrewMonthLength,
  hebrewMonthsInYear,
  hijriMonthLength,
  isLeapHebrewYear,
  isLeapHijriYear,
  isLeapJalaaliYear,
  jalaaliMonthLength,
} from '../index'

describe('Islamic adapter integration', () => {
  const adapter = new IslamicAdapter('en-US')

  // Muharram 1447 AH (month 0 in 0-indexed) - known to start June 27, 2025
  const muharram1447 = adapter.create(1447, 0, 15)

  const baseConfig = {
    showOutsideDays: true,
    fixedWeeks: false,
    locale: { weekStartDay: 0 as const },
  }

  describe('buildCalendarMonth', () => {
    it('produces a valid grid for Muharram 1447', () => {
      const result = buildCalendarMonth(adapter, muharram1447, baseConfig)
      expect(result.weeks.length).toBeGreaterThanOrEqual(4)
      expect(result.weeks.length).toBeLessThanOrEqual(6)
      for (const week of result.weeks) {
        expect(week.days).toHaveLength(7)
      }
    })

    it('grid covers exactly the right number of in-month days for Muharram (30)', () => {
      const result = buildCalendarMonth(adapter, muharram1447, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      // Muharram is month 1 (odd) = 30 days
      expect(inMonth).toHaveLength(hijriMonthLength(1447, 1))
      expect(inMonth).toHaveLength(30)
    })

    it('grid covers exactly the right number of in-month days for Safar (29)', () => {
      const safar1447 = adapter.create(1447, 1, 15) // month index 1 = Safar
      const result = buildCalendarMonth(adapter, safar1447, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(hijriMonthLength(1447, 2))
      expect(inMonth).toHaveLength(29)
    })

    it('each day has correct calendar-system dates (Hijri year ~1447)', () => {
      const result = buildCalendarMonth(adapter, muharram1447, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (const day of inMonth) {
        expect(adapter.getYear(day.date)).toBe(1447)
        expect(adapter.getMonth(day.date)).toBe(0) // 0-indexed Muharram
      }
    })

    it('in-month days are numbered 1 through N sequentially', () => {
      const result = buildCalendarMonth(adapter, muharram1447, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (let i = 0; i < inMonth.length; i++) {
        expect(adapter.getDate(inMonth[i]!.date)).toBe(i + 1)
      }
    })

    it('fixedWeeks always returns 6 weeks', () => {
      const result = buildCalendarMonth(adapter, muharram1447, { ...baseConfig, fixedWeeks: true })
      expect(result.weeks).toHaveLength(6)
    })
  })

  describe('year values', () => {
    it('year is approximately 1447 for dates around June 2025', () => {
      const year = adapter.getYear(muharram1447)
      expect(year).toBe(1447)
    })

    it('year is approximately 1448 for dates around June 2026', () => {
      const date = adapter.create(1448, 0, 1)
      expect(adapter.getYear(date)).toBe(1448)
    })
  })

  describe('navigation', () => {
    it('addMonths(+1) moves to the next Hijri month', () => {
      const next = adapter.addMonths(muharram1447, 1)
      expect(adapter.getYear(next)).toBe(1447)
      expect(adapter.getMonth(next)).toBe(1) // Safar
    })

    it('addMonths(-1) moves to the previous Hijri month', () => {
      const prev = adapter.addMonths(muharram1447, -1)
      expect(adapter.getYear(prev)).toBe(1446)
      expect(adapter.getMonth(prev)).toBe(11) // Dhu al-Hijjah of 1446
    })

    it('navigating 12 months forward lands in the next year', () => {
      const yearLater = adapter.addMonths(muharram1447, 12)
      expect(adapter.getYear(yearLater)).toBe(1448)
      expect(adapter.getMonth(yearLater)).toBe(0) // Muharram
    })

    it('buildMultiMonth produces 3 consecutive Hijri months', () => {
      const months = buildMultiMonth(adapter, muharram1447, 3, baseConfig)
      expect(months).toHaveLength(3)

      // First is Muharram
      const m0Days = months[0]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m0Days[0]!.date)).toBe(0)

      // Second is Safar
      const m1Days = months[1]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m1Days[0]!.date)).toBe(1)

      // Third is Rabi al-Awwal
      const m2Days = months[2]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m2Days[0]!.date)).toBe(2)
    })
  })

  describe('selection', () => {
    it('single selection works on a Hijri date', () => {
      const day = adapter.create(1447, 0, 10)
      const result = selectDay(adapter, 'single', null, day)
      expect(result).not.toBeNull()
      expect(adapter.isSameDay(result as Date, day)).toBe(true)
    })

    it('single selection deselects on same date', () => {
      const day = adapter.create(1447, 0, 10)
      const result = selectDay(adapter, 'single', day, day)
      expect(result).toBeNull()
    })

    it('range selection works across Hijri dates', () => {
      const from = adapter.create(1447, 0, 5)
      const to = adapter.create(1447, 0, 20)
      const step1 = selectDay(adapter, 'range', null, from) as Selection.DateRange<Date>
      expect(step1.from).toBeDefined()
      expect(step1.to).toBeNull()

      const step2 = selectDay(adapter, 'range', step1, to) as Selection.DateRange<Date>
      expect(adapter.isSameDay(step2.from, from)).toBe(true)
      expect(adapter.isSameDay(step2.to!, to)).toBe(true)
    })

    it('multi selection works on Hijri dates', () => {
      const d1 = adapter.create(1447, 0, 5)
      const d2 = adapter.create(1447, 0, 15)
      const d3 = adapter.create(1447, 0, 25)
      let result = selectDay(adapter, 'multi', [], d1)
      result = selectDay(adapter, 'multi', result, d2)
      result = selectDay(adapter, 'multi', result, d3)
      expect(result).toHaveLength(3)
    })

    it('applySelection marks selected day in the Hijri grid', () => {
      const day = adapter.create(1447, 0, 15)
      const grid = buildCalendarMonth(adapter, muharram1447, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'single', day)
      const selectedDays = applied.flatMap((w) => w.days).filter((d) => d.isSelected)
      expect(selectedDays).toHaveLength(1)
      expect(adapter.isSameDay(selectedDays[0]!.date, day)).toBe(true)
    })

    it('applySelection marks range in the Hijri grid', () => {
      const from = adapter.create(1447, 0, 5)
      const to = adapter.create(1447, 0, 10)
      const range: Selection.DateRange<Date> = { from, to }
      const grid = buildCalendarMonth(adapter, muharram1447, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'range', range)
      const rangeStart = applied.flatMap((w) => w.days).filter((d) => d.isRangeStart)
      const rangeEnd = applied.flatMap((w) => w.days).filter((d) => d.isRangeEnd)
      const rangeMiddle = applied.flatMap((w) => w.days).filter((d) => d.isRangeMiddle)
      expect(rangeStart).toHaveLength(1)
      expect(rangeEnd).toHaveLength(1)
      expect(rangeMiddle).toHaveLength(4) // days 6, 7, 8, 9
    })
  })

  describe('leap year handling', () => {
    it('1447 is a leap year (Dhu al-Hijjah has 30 days)', () => {
      expect(isLeapHijriYear(1447)).toBe(true)
      expect(hijriMonthLength(1447, 12)).toBe(30)
    })

    it('1448 is not a leap year (Dhu al-Hijjah has 29 days)', () => {
      expect(isLeapHijriYear(1448)).toBe(false)
      expect(hijriMonthLength(1448, 12)).toBe(29)
    })

    it('grid for Dhu al-Hijjah 1447 (leap) has 30 in-month days', () => {
      const dhulhijjah = adapter.create(1447, 11, 1) // 0-indexed month 11
      const result = buildCalendarMonth(adapter, dhulhijjah, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(30)
    })

    it('grid for Dhu al-Hijjah 1448 (non-leap) has 29 in-month days', () => {
      const dhulhijjah = adapter.create(1448, 11, 1)
      const result = buildCalendarMonth(adapter, dhulhijjah, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(29)
    })
  })

  describe('hijriMonthLength', () => {
    it('returns correct values for all 12 months of 1447', () => {
      const expected = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30]
      for (let m = 1; m <= 12; m++) {
        expect(hijriMonthLength(1447, m)).toBe(expected[m - 1])
      }
    })

    it('returns correct values for all 12 months of 1448 (non-leap)', () => {
      const expected = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]
      for (let m = 1; m <= 12; m++) {
        expect(hijriMonthLength(1448, m)).toBe(expected[m - 1])
      }
    })
  })
})

describe('Hebrew adapter integration', () => {
  const adapter = new HebrewAdapter('en-US')

  // Tishrei 5786 (month 0 in 0-indexed) - starts Sep 23, 2025
  const tishrei5786 = adapter.create(5786, 0, 15)

  const baseConfig = {
    showOutsideDays: true,
    fixedWeeks: false,
    locale: { weekStartDay: 0 as const },
  }

  describe('buildCalendarMonth', () => {
    it('produces a valid grid for Tishrei 5786', () => {
      const result = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      expect(result.weeks.length).toBeGreaterThanOrEqual(4)
      expect(result.weeks.length).toBeLessThanOrEqual(6)
      for (const week of result.weeks) {
        expect(week.days).toHaveLength(7)
      }
    })

    it('grid covers exactly 30 in-month days for Tishrei', () => {
      const result = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(hebrewMonthLength(5786, 1))
      expect(inMonth).toHaveLength(30)
    })

    it('grid covers correct days for Tevet (month 4, always 29 days)', () => {
      const tevet = adapter.create(5786, 3, 15) // 0-indexed month 3 = Tevet
      const result = buildCalendarMonth(adapter, tevet, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(hebrewMonthLength(5786, 4))
      expect(inMonth).toHaveLength(29)
    })

    it('each day in Tishrei grid has correct calendar-system dates', () => {
      const result = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (const day of inMonth) {
        expect(adapter.getYear(day.date)).toBe(5786)
        expect(adapter.getMonth(day.date)).toBe(0) // 0-indexed Tishrei
      }
    })

    it('in-month days are numbered 1 through N sequentially', () => {
      const result = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (let i = 0; i < inMonth.length; i++) {
        expect(adapter.getDate(inMonth[i]!.date)).toBe(i + 1)
      }
    })
  })

  describe('year values', () => {
    it('year is 5786 for dates around Sep 2025', () => {
      expect(adapter.getYear(tishrei5786)).toBe(5786)
    })

    it('year is 5784 for a known leap year', () => {
      const date = adapter.create(5784, 0, 1)
      expect(adapter.getYear(date)).toBe(5784)
    })
  })

  describe('navigation', () => {
    it('addMonths(+1) moves to the next Hebrew month', () => {
      const next = adapter.addMonths(tishrei5786, 1)
      expect(adapter.getYear(next)).toBe(5786)
      expect(adapter.getMonth(next)).toBe(1) // Cheshvan
    })

    it('addMonths(-1) moves to the previous Hebrew month', () => {
      const prev = adapter.addMonths(tishrei5786, -1)
      expect(adapter.getYear(prev)).toBe(5785)
      // Last month of 5785: if 5785 is leap -> 12 (Elul = index 12), if common -> 11 (Elul = index 11)
      const monthsIn5785 = hebrewMonthsInYear(5785)
      expect(adapter.getMonth(prev)).toBe(monthsIn5785 - 1) // 0-indexed last month
    })

    it('navigating through all months of a common year lands back at same month next year', () => {
      // 5786 is a common year with 12 months
      const monthCount = hebrewMonthsInYear(5786)
      expect(monthCount).toBe(12)
      const yearLater = adapter.addMonths(tishrei5786, monthCount)
      expect(adapter.getYear(yearLater)).toBe(5787)
      expect(adapter.getMonth(yearLater)).toBe(0) // Tishrei
    })

    it('buildMultiMonth produces 3 consecutive Hebrew months', () => {
      const months = buildMultiMonth(adapter, tishrei5786, 3, baseConfig)
      expect(months).toHaveLength(3)

      const m0Days = months[0]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m0Days[0]!.date)).toBe(0) // Tishrei

      const m1Days = months[1]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m1Days[0]!.date)).toBe(1) // Cheshvan

      const m2Days = months[2]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m2Days[0]!.date)).toBe(2) // Kislev
    })
  })

  describe('selection', () => {
    it('single selection works on a Hebrew date', () => {
      const day = adapter.create(5786, 0, 10)
      const result = selectDay(adapter, 'single', null, day)
      expect(result).not.toBeNull()
      expect(adapter.isSameDay(result as Date, day)).toBe(true)
    })

    it('single selection deselects on same date', () => {
      const day = adapter.create(5786, 0, 10)
      const result = selectDay(adapter, 'single', day, day)
      expect(result).toBeNull()
    })

    it('range selection works across Hebrew dates', () => {
      const from = adapter.create(5786, 0, 5)
      const to = adapter.create(5786, 0, 20)
      const step1 = selectDay(adapter, 'range', null, from) as Selection.DateRange<Date>
      expect(step1.from).toBeDefined()
      expect(step1.to).toBeNull()

      const step2 = selectDay(adapter, 'range', step1, to) as Selection.DateRange<Date>
      expect(adapter.isSameDay(step2.from, from)).toBe(true)
      expect(adapter.isSameDay(step2.to!, to)).toBe(true)
    })

    it('multi selection accumulates Hebrew dates', () => {
      const d1 = adapter.create(5786, 0, 5)
      const d2 = adapter.create(5786, 0, 15)
      const d3 = adapter.create(5786, 0, 25)
      let result = selectDay(adapter, 'multi', [], d1)
      result = selectDay(adapter, 'multi', result, d2)
      result = selectDay(adapter, 'multi', result, d3)
      expect(result).toHaveLength(3)
    })

    it('applySelection marks selected day in the Hebrew grid', () => {
      const day = adapter.create(5786, 0, 15)
      const grid = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'single', day)
      const selectedDays = applied.flatMap((w) => w.days).filter((d) => d.isSelected)
      expect(selectedDays).toHaveLength(1)
      expect(adapter.isSameDay(selectedDays[0]!.date, day)).toBe(true)
    })

    it('applySelection marks range in the Hebrew grid', () => {
      const from = adapter.create(5786, 0, 5)
      const to = adapter.create(5786, 0, 10)
      const range: Selection.DateRange<Date> = { from, to }
      const grid = buildCalendarMonth(adapter, tishrei5786, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'range', range)
      const rangeStart = applied.flatMap((w) => w.days).filter((d) => d.isRangeStart)
      const rangeEnd = applied.flatMap((w) => w.days).filter((d) => d.isRangeEnd)
      const rangeMiddle = applied.flatMap((w) => w.days).filter((d) => d.isRangeMiddle)
      expect(rangeStart).toHaveLength(1)
      expect(rangeEnd).toHaveLength(1)
      expect(rangeMiddle).toHaveLength(4) // days 6, 7, 8, 9
    })
  })

  describe('leap year handling', () => {
    it('5784 is a leap year with 13 months', () => {
      expect(isLeapHebrewYear(5784)).toBe(true)
      expect(hebrewMonthsInYear(5784)).toBe(13)
    })

    it('5786 is a common year with 12 months', () => {
      expect(isLeapHebrewYear(5786)).toBe(false)
      expect(hebrewMonthsInYear(5786)).toBe(12)
    })

    it('Adar in common year 5786 (month 6) has 29 days', () => {
      expect(hebrewMonthLength(5786, 6)).toBe(29)
    })

    it('Adar I in leap year 5784 (month 6) has 30 days', () => {
      expect(hebrewMonthLength(5784, 6)).toBe(30)
    })

    it('grid for Adar I in leap year 5784 has 30 in-month days', () => {
      const adarI = adapter.create(5784, 5, 1) // 0-indexed month 5 = Adar I
      const result = buildCalendarMonth(adapter, adarI, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(30)
    })

    it('grid for Adar II in leap year 5784 has 29 in-month days', () => {
      const adarII = adapter.create(5784, 6, 1) // 0-indexed month 6 = Adar II
      const result = buildCalendarMonth(adapter, adarII, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(29)
    })

    it('buildCalendarYear returns 13 months for a leap year (5784)', () => {
      const probe = adapter.create(5784, 0, 1)
      const result = buildCalendarYear(adapter, probe)
      expect(result).toHaveLength(13)
    })

    it('buildCalendarYear returns 12 months for a common year (5786)', () => {
      const probe = adapter.create(5786, 0, 1)
      const result = buildCalendarYear(adapter, probe)
      expect(result).toHaveLength(12)
    })
  })

  describe('hebrewMonthLength', () => {
    it('Tishrei (month 1) always has 30 days', () => {
      expect(hebrewMonthLength(5786, 1)).toBe(30)
      expect(hebrewMonthLength(5784, 1)).toBe(30)
    })

    it('Tevet (month 4) always has 29 days', () => {
      expect(hebrewMonthLength(5786, 4)).toBe(29)
    })

    it('Shevat (month 5) always has 30 days', () => {
      expect(hebrewMonthLength(5786, 5)).toBe(30)
    })

    it('returns 0 for out-of-range months', () => {
      expect(hebrewMonthLength(5786, 0)).toBe(0)
      expect(hebrewMonthLength(5786, 14)).toBe(0)
    })
  })
})

describe('Persian adapter integration', () => {
  const adapter = new PersianAdapter('en-US')

  // Farvardin 1404 (month 0 in 0-indexed) - starts March 21, 2025
  const farvardin1404 = adapter.create(1404, 0, 15)

  const baseConfig = {
    showOutsideDays: true,
    fixedWeeks: false,
    locale: { weekStartDay: 0 as const },
  }

  describe('buildCalendarMonth', () => {
    it('produces a valid grid for Farvardin 1404', () => {
      const result = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      expect(result.weeks.length).toBeGreaterThanOrEqual(4)
      expect(result.weeks.length).toBeLessThanOrEqual(6)
      for (const week of result.weeks) {
        expect(week.days).toHaveLength(7)
      }
    })

    it('grid covers exactly 31 in-month days for Farvardin (month 1)', () => {
      const result = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(jalaaliMonthLength(1404, 1))
      expect(inMonth).toHaveLength(31)
    })

    it('grid covers exactly 30 in-month days for Mehr (month 7)', () => {
      const mehr = adapter.create(1404, 6, 15) // 0-indexed month 6 = Mehr
      const result = buildCalendarMonth(adapter, mehr, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(jalaaliMonthLength(1404, 7))
      expect(inMonth).toHaveLength(30)
    })

    it('each day in Farvardin grid has correct calendar-system dates', () => {
      const result = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (const day of inMonth) {
        expect(adapter.getYear(day.date)).toBe(1404)
        expect(adapter.getMonth(day.date)).toBe(0) // 0-indexed Farvardin
      }
    })

    it('in-month days are numbered 1 through N sequentially', () => {
      const result = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      for (let i = 0; i < inMonth.length; i++) {
        expect(adapter.getDate(inMonth[i]!.date)).toBe(i + 1)
      }
    })

    it('fixedWeeks always returns 6 weeks', () => {
      const result = buildCalendarMonth(adapter, farvardin1404, { ...baseConfig, fixedWeeks: true })
      expect(result.weeks).toHaveLength(6)
    })
  })

  describe('year values', () => {
    it('year is 1404 for dates around March 2025', () => {
      expect(adapter.getYear(farvardin1404)).toBe(1404)
    })

    it('year is 1405 for Nowruz 1405 (around March 21, 2026)', () => {
      const nowruz1405 = adapter.create(1405, 0, 1)
      expect(adapter.getYear(nowruz1405)).toBe(1405)
    })
  })

  describe('navigation', () => {
    it('addMonths(+1) moves to the next Persian month', () => {
      const next = adapter.addMonths(farvardin1404, 1)
      expect(adapter.getYear(next)).toBe(1404)
      expect(adapter.getMonth(next)).toBe(1) // Ordibehesht
    })

    it('addMonths(-1) moves to the previous Persian month', () => {
      const prev = adapter.addMonths(farvardin1404, -1)
      expect(adapter.getYear(prev)).toBe(1403)
      expect(adapter.getMonth(prev)).toBe(11) // Esfand
    })

    it('navigating 12 months forward lands in the next year', () => {
      const yearLater = adapter.addMonths(farvardin1404, 12)
      expect(adapter.getYear(yearLater)).toBe(1405)
      expect(adapter.getMonth(yearLater)).toBe(0) // Farvardin
    })

    it('buildMultiMonth produces 3 consecutive Persian months', () => {
      const months = buildMultiMonth(adapter, farvardin1404, 3, baseConfig)
      expect(months).toHaveLength(3)

      const m0Days = months[0]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m0Days[0]!.date)).toBe(0) // Farvardin

      const m1Days = months[1]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m1Days[0]!.date)).toBe(1) // Ordibehesht

      const m2Days = months[2]!.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(adapter.getMonth(m2Days[0]!.date)).toBe(2) // Khordad
    })
  })

  describe('selection', () => {
    it('single selection works on a Persian date', () => {
      const day = adapter.create(1404, 0, 10)
      const result = selectDay(adapter, 'single', null, day)
      expect(result).not.toBeNull()
      expect(adapter.isSameDay(result as Date, day)).toBe(true)
    })

    it('single selection deselects on same date', () => {
      const day = adapter.create(1404, 0, 10)
      const result = selectDay(adapter, 'single', day, day)
      expect(result).toBeNull()
    })

    it('range selection works across Persian dates', () => {
      const from = adapter.create(1404, 0, 5)
      const to = adapter.create(1404, 0, 20)
      const step1 = selectDay(adapter, 'range', null, from) as Selection.DateRange<Date>
      expect(step1.from).toBeDefined()
      expect(step1.to).toBeNull()

      const step2 = selectDay(adapter, 'range', step1, to) as Selection.DateRange<Date>
      expect(adapter.isSameDay(step2.from, from)).toBe(true)
      expect(adapter.isSameDay(step2.to!, to)).toBe(true)
    })

    it('multi selection accumulates Persian dates', () => {
      const d1 = adapter.create(1404, 0, 5)
      const d2 = adapter.create(1404, 0, 15)
      const d3 = adapter.create(1404, 0, 25)
      let result = selectDay(adapter, 'multi', [], d1)
      result = selectDay(adapter, 'multi', result, d2)
      result = selectDay(adapter, 'multi', result, d3)
      expect(result).toHaveLength(3)
    })

    it('applySelection marks selected day in the Persian grid', () => {
      const day = adapter.create(1404, 0, 15)
      const grid = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'single', day)
      const selectedDays = applied.flatMap((w) => w.days).filter((d) => d.isSelected)
      expect(selectedDays).toHaveLength(1)
      expect(adapter.isSameDay(selectedDays[0]!.date, day)).toBe(true)
    })

    it('applySelection marks range in the Persian grid', () => {
      const from = adapter.create(1404, 0, 5)
      const to = adapter.create(1404, 0, 10)
      const range: Selection.DateRange<Date> = { from, to }
      const grid = buildCalendarMonth(adapter, farvardin1404, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'range', range)
      const rangeStart = applied.flatMap((w) => w.days).filter((d) => d.isRangeStart)
      const rangeEnd = applied.flatMap((w) => w.days).filter((d) => d.isRangeEnd)
      const rangeMiddle = applied.flatMap((w) => w.days).filter((d) => d.isRangeMiddle)
      expect(rangeStart).toHaveLength(1)
      expect(rangeEnd).toHaveLength(1)
      expect(rangeMiddle).toHaveLength(4) // days 6, 7, 8, 9
    })
  })

  describe('leap year handling', () => {
    it('1403 is a leap year (Esfand has 30 days)', () => {
      expect(isLeapJalaaliYear(1403)).toBe(true)
      expect(jalaaliMonthLength(1403, 12)).toBe(30)
    })

    it('1404 is not a leap year (Esfand has 29 days)', () => {
      expect(isLeapJalaaliYear(1404)).toBe(false)
      expect(jalaaliMonthLength(1404, 12)).toBe(29)
    })

    it('grid for Esfand 1403 (leap) has 30 in-month days', () => {
      const esfand = adapter.create(1403, 11, 1) // 0-indexed month 11 = Esfand
      const result = buildCalendarMonth(adapter, esfand, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(30)
    })

    it('grid for Esfand 1404 (non-leap) has 29 in-month days', () => {
      const esfand = adapter.create(1404, 11, 1)
      const result = buildCalendarMonth(adapter, esfand, baseConfig)
      const inMonth = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(inMonth).toHaveLength(29)
    })
  })

  describe('jalaaliMonthLength', () => {
    it('months 1-6 have 31 days', () => {
      for (let m = 1; m <= 6; m++) {
        expect(jalaaliMonthLength(1404, m)).toBe(31)
      }
    })

    it('months 7-11 have 30 days', () => {
      for (let m = 7; m <= 11; m++) {
        expect(jalaaliMonthLength(1404, m)).toBe(30)
      }
    })

    it('month 12 has 29 days in non-leap year 1404', () => {
      expect(jalaaliMonthLength(1404, 12)).toBe(29)
    })

    it('month 12 has 30 days in leap year 1403', () => {
      expect(jalaaliMonthLength(1403, 12)).toBe(30)
    })
  })
})

describe('cross-calendar consistency', () => {
  const islamic = new IslamicAdapter('en-US')
  const hebrew = new HebrewAdapter('en-US')
  const persian = new PersianAdapter('en-US')

  const baseConfig = {
    showOutsideDays: true,
    fixedWeeks: false,
    locale: { weekStartDay: 0 as const },
  }

  it('all adapters produce grids where every week has 7 days', () => {
    const adapters = [
      { adapter: islamic, date: islamic.create(1447, 0, 1) },
      { adapter: hebrew, date: hebrew.create(5786, 0, 1) },
      { adapter: persian, date: persian.create(1404, 0, 1) },
    ] as const

    for (const { adapter, date } of adapters) {
      const result = buildCalendarMonth(adapter, date, baseConfig)
      for (const week of result.weeks) {
        expect(week.days).toHaveLength(7)
      }
    }
  })

  it('all adapters produce grids with 4-6 weeks', () => {
    const adapters = [
      { adapter: islamic, date: islamic.create(1447, 0, 1) },
      { adapter: hebrew, date: hebrew.create(5786, 0, 1) },
      { adapter: persian, date: persian.create(1404, 0, 1) },
    ] as const

    for (const { adapter, date } of adapters) {
      const result = buildCalendarMonth(adapter, date, baseConfig)
      expect(result.weeks.length).toBeGreaterThanOrEqual(4)
      expect(result.weeks.length).toBeLessThanOrEqual(6)
    }
  })

  it('all adapters produce grids where first cell of first week starts on the correct weekday', () => {
    const adapters = [
      { adapter: islamic, date: islamic.create(1447, 0, 1) },
      { adapter: hebrew, date: hebrew.create(5786, 0, 1) },
      { adapter: persian, date: persian.create(1404, 0, 1) },
    ] as const

    for (const { adapter, date } of adapters) {
      const result = buildCalendarMonth(adapter, date, baseConfig)
      const firstCell = result.weeks[0]!.days[0]!
      expect(adapter.getDayOfWeek(firstCell.date)).toBe(0) // Sunday (weekStartDay=0)
    }
  })

  it('selection defaults are false in all calendar grids', () => {
    const adapters = [
      { adapter: islamic, date: islamic.create(1447, 0, 1) },
      { adapter: hebrew, date: hebrew.create(5786, 0, 1) },
      { adapter: persian, date: persian.create(1404, 0, 1) },
    ] as const

    for (const { adapter, date } of adapters) {
      const result = buildCalendarMonth(adapter, date, baseConfig)
      for (const week of result.weeks) {
        for (const day of week.days) {
          expect(day.isSelected).toBe(false)
          expect(day.isRangeStart).toBe(false)
          expect(day.isRangeEnd).toBe(false)
          expect(day.isRangeMiddle).toBe(false)
        }
      }
    }
  })

  it('selection with constraints (fromDate/toDate) works in all calendar systems', () => {
    const adapters = [
      {
        adapter: islamic,
        date: islamic.create(1447, 0, 15),
        from: islamic.create(1447, 0, 10),
        to: islamic.create(1447, 0, 20),
      },
      {
        adapter: hebrew,
        date: hebrew.create(5786, 0, 15),
        from: hebrew.create(5786, 0, 10),
        to: hebrew.create(5786, 0, 20),
      },
      {
        adapter: persian,
        date: persian.create(1404, 0, 15),
        from: persian.create(1404, 0, 10),
        to: persian.create(1404, 0, 20),
      },
    ] as const

    for (const { adapter, date, from, to } of adapters) {
      const grid = buildCalendarMonth(adapter, date, baseConfig)
      const applied = applySelection(grid.weeks, adapter, 'single', null, { fromDate: from, toDate: to })
      const allDays = applied.flatMap((w) => w.days).filter((d) => !d.isOutside)

      // Days before fromDate should be disabled
      const beforeFrom = allDays.filter((d) => adapter.isBefore(d.date, from))
      for (const d of beforeFrom) {
        expect(d.isDisabled).toBe(true)
      }

      // Days after toDate should be disabled
      const afterTo = allDays.filter((d) => adapter.isAfter(d.date, to))
      for (const d of afterTo) {
        expect(d.isDisabled).toBe(true)
      }

      // Days in range should not be disabled (unless outside)
      const inRange = allDays.filter(
        (d) =>
          !d.isOutside &&
          (adapter.isSameDay(d.date, from) || adapter.isAfter(d.date, from)) &&
          (adapter.isSameDay(d.date, to) || adapter.isBefore(d.date, to)),
      )
      for (const d of inRange) {
        expect(d.isDisabled).toBe(false)
      }
    }
  })
})
