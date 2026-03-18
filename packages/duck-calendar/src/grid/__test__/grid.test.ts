import { beforeEach, describe, expect, it } from 'vitest'
import { NativeAdapter } from '../../adapter'
import { buildCalendarMonth, buildCalendarYear, buildDecadeView } from '../grid'
import { getLocalizedMonthNames, getLocalizedWeekdays, getWeekNumber } from '../grid.libs'

describe('grid', () => {
  let adapter: NativeAdapter

  beforeEach(() => {
    adapter = new NativeAdapter()
  })

  // ---------------------------------------------------------------------------
  // buildCalendarMonth
  // ---------------------------------------------------------------------------
  describe('buildCalendarMonth', () => {
    const march2026 = new Date(2026, 2, 1) // March 1 2026 — starts on Sunday

    const baseConfig = {
      showOutsideDays: true,
      fixedWeeks: false,
      locale: { weekStartDay: 0 as const },
    }

    it('returns a CalendarMonth with the correct month date', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      expect(result.month.getMonth()).toBe(2)
      expect(result.month.getFullYear()).toBe(2026)
      expect(result.month.getDate()).toBe(1)
    })

    it('each week has exactly 7 days', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      for (const week of result.weeks) {
        expect(week.days).toHaveLength(7)
      }
    })

    it('March 2026 has 5 weeks (not fixedWeeks)', () => {
      // March 2026: starts Sunday, ends Tuesday → 5 rows
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      expect(result.weeks).toHaveLength(5)
    })

    it('fixedWeeks always returns 6 weeks', () => {
      const result = buildCalendarMonth(adapter, march2026, { ...baseConfig, fixedWeeks: true })
      expect(result.weeks).toHaveLength(6)
    })

    it('Feb 2026 has 4 weeks (28 days, starts Sunday)', () => {
      const feb2026 = new Date(2026, 1, 1) // Feb 1 is a Sunday
      const result = buildCalendarMonth(adapter, feb2026, baseConfig)
      expect(result.weeks).toHaveLength(4)
    })

    it('sets isOutside correctly for days not in the target month', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      const firstWeek = result.weeks[0]!
      // March 2026 starts on Sunday so no outside days in first row
      for (const day of firstWeek.days) {
        expect(day.isOutside).toBe(false)
      }

      const lastWeek = result.weeks[result.weeks.length - 1]!
      // Last week of March ends on Tuesday (31st), so Wed–Sat are April days
      const outsideDays = lastWeek.days.filter((d) => d.isOutside)
      expect(outsideDays.length).toBeGreaterThan(0)
      for (const d of outsideDays) {
        expect(d.date.getMonth()).toBe(3) // April
      }
    })

    it('sets isWeekend for Saturday and Sunday', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      for (const week of result.weeks) {
        for (const day of week.days) {
          const dow = day.date.getDay()
          if (dow === 0 || dow === 6) {
            expect(day.isWeekend).toBe(true)
          } else {
            expect(day.isWeekend).toBe(false)
          }
        }
      }
    })

    it('selection flags all default to false', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      for (const week of result.weeks) {
        for (const day of week.days) {
          expect(day.isSelected).toBe(false)
          expect(day.isDisabled).toBe(false)
          expect(day.isRangeStart).toBe(false)
          expect(day.isRangeEnd).toBe(false)
          expect(day.isRangeMiddle).toBe(false)
        }
      }
    })

    it('weekStartDay=1 (Monday) shifts the grid — first cell is a Monday', () => {
      const result = buildCalendarMonth(adapter, march2026, {
        ...baseConfig,
        locale: { weekStartDay: 1 as const },
      })
      const firstCell = result.weeks[0]!.days[0]!
      expect(firstCell.date.getDay()).toBe(1) // Monday
    })

    it('weekStartDay=0 (Sunday) — first cell is a Sunday', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      const firstCell = result.weeks[0]!.days[0]!
      expect(firstCell.date.getDay()).toBe(0) // Sunday
    })

    it('covers all days of the target month', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      const allDates = result.weeks.flatMap((w) => w.days).filter((d) => !d.isOutside)
      expect(allDates).toHaveLength(31) // March has 31 days
      expect(allDates[0]!.date.getDate()).toBe(1)
      expect(allDates[30]!.date.getDate()).toBe(31)
    })

    it('each week has a weekNumber', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      for (const week of result.weeks) {
        expect(typeof week.weekNumber).toBe('number')
        expect(week.weekNumber).toBeGreaterThan(0)
        expect(week.weekNumber).toBeLessThanOrEqual(53)
      }
    })

    it('March 2026 week numbers are sequential', () => {
      const result = buildCalendarMonth(adapter, march2026, baseConfig)
      const numbers = result.weeks.map((w) => w.weekNumber)
      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).toBe(numbers[i - 1]! + 1)
      }
    })

    it('no locale defaults weekStartDay to 0', () => {
      const result = buildCalendarMonth(adapter, march2026, {
        showOutsideDays: true,
        fixedWeeks: false,
        locale: undefined,
      })
      const firstCell = result.weeks[0]!.days[0]!
      expect(firstCell.date.getDay()).toBe(0)
    })
  })

  // ---------------------------------------------------------------------------
  // buildCalendarYear
  // ---------------------------------------------------------------------------
  describe('buildCalendarYear', () => {
    it('returns exactly 12 entries', () => {
      const result = buildCalendarYear(adapter, new Date(2026, 0, 1))
      expect(result).toHaveLength(12)
    })

    it('month indices are 0–11 in order', () => {
      const result = buildCalendarYear(adapter, new Date(2026, 0, 1))
      result.forEach((entry, i) => {
        expect(entry.month).toBe(i)
      })
    })

    it('all entries have a non-empty label', () => {
      const result = buildCalendarYear(adapter, new Date(2026, 0, 1), 'en-US')
      for (const entry of result) {
        expect(typeof entry.label).toBe('string')
        expect(entry.label.length).toBeGreaterThan(0)
      }
    })

    it('isCurrent is true only for the current month/year', () => {
      const today = adapter.today()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      const result = buildCalendarYear(adapter, today)
      const currentEntries = result.filter((e) => e.isCurrent)
      expect(currentEntries).toHaveLength(1)
      expect(currentEntries[0]!.month).toBe(currentMonth)
      // viewYear matches currentYear so exactly one isCurrent
      expect(result[currentMonth]!.isCurrent).toBe(true)
    })

    it('isCurrent is false for all entries when viewing a different year', () => {
      const result = buildCalendarYear(adapter, new Date(1900, 0, 1))
      expect(result.every((e) => !e.isCurrent)).toBe(true)
    })

    it('en-US January label is "January"', () => {
      const result = buildCalendarYear(adapter, new Date(2026, 0, 1), 'en-US')
      expect(result[0]!.label).toBe('January')
    })
  })

  // ---------------------------------------------------------------------------
  // buildDecadeView
  // ---------------------------------------------------------------------------
  describe('buildDecadeView', () => {
    it('returns exactly 12 entries', () => {
      const result = buildDecadeView(adapter, new Date(2026, 0, 1))
      expect(result).toHaveLength(12)
    })

    it('years are consecutive', () => {
      const result = buildDecadeView(adapter, new Date(2026, 0, 1))
      for (let i = 1; i < result.length; i++) {
        expect(result[i]!.year).toBe(result[i - 1]!.year + 1)
      }
    })

    it('decade for 2026 starts at 2019 (decade 2020, -1 context)', () => {
      // floor(2026/10)*10 = 2020, minus 1 = 2019
      const result = buildDecadeView(adapter, new Date(2026, 0, 1))
      expect(result[0]!.year).toBe(2019)
      expect(result[11]!.year).toBe(2030)
    })

    it('isCurrent is true only for the current year', () => {
      const today = adapter.today()
      const currentYear = today.getFullYear()
      const result = buildDecadeView(adapter, today)
      const currentEntries = result.filter((e) => e.isCurrent)
      expect(currentEntries).toHaveLength(1)
      expect(currentEntries[0]!.year).toBe(currentYear)
    })

    it('isCurrent is false for all entries when current year is out of range', () => {
      const result = buildDecadeView(adapter, new Date(1800, 0, 1))
      expect(result.every((e) => !e.isCurrent)).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // getLocalizedWeekdays
  // ---------------------------------------------------------------------------
  describe('getLocalizedWeekdays', () => {
    it('returns 7 entries', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 0)
      expect(result).toHaveLength(7)
    })

    it('weekStartDay=0 starts with Sunday', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 0, 'short')
      expect(result[0]).toBe('Sun')
    })

    it('weekStartDay=1 starts with Monday', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 1, 'short')
      expect(result[0]).toBe('Mon')
    })

    it('weekStartDay=6 starts with Saturday', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 6, 'short')
      expect(result[0]).toBe('Sat')
    })

    it('contains all 7 unique day names', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 0, 'short')
      expect(new Set(result).size).toBe(7)
    })

    it('long format returns full day names', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 0, 'long')
      expect(result[0]).toBe('Sunday')
    })

    it('narrow format returns single letter', () => {
      const result = getLocalizedWeekdays(adapter, 'en-US', 0, 'narrow')
      expect(result[0]).toBe('S')
    })

    it('defaults to short format', () => {
      const withDefault = getLocalizedWeekdays(adapter, 'en-US', 0)
      const withShort = getLocalizedWeekdays(adapter, 'en-US', 0, 'short')
      expect(withDefault).toEqual(withShort)
    })
  })

  // ---------------------------------------------------------------------------
  // getLocalizedMonthNames
  // ---------------------------------------------------------------------------
  describe('getLocalizedMonthNames', () => {
    it('returns 12 entries', () => {
      const result = getLocalizedMonthNames(adapter, 'en-US')
      expect(result).toHaveLength(12)
    })

    it('first entry is January, last is December', () => {
      const result = getLocalizedMonthNames(adapter, 'en-US')
      expect(result[0]).toBe('January')
      expect(result[11]).toBe('December')
    })

    it('short format', () => {
      const result = getLocalizedMonthNames(adapter, 'en-US', 'short')
      expect(result[0]).toBe('Jan')
      expect(result[11]).toBe('Dec')
    })

    it('narrow format', () => {
      const result = getLocalizedMonthNames(adapter, 'en-US', 'narrow')
      expect(result[0]).toBe('J')
    })

    it('all 12 names are non-empty strings', () => {
      const result = getLocalizedMonthNames(adapter, 'en-US')
      for (const name of result) {
        expect(typeof name).toBe('string')
        expect(name.length).toBeGreaterThan(0)
      }
    })
  })

  // ---------------------------------------------------------------------------
  // getWeekNumber
  // ---------------------------------------------------------------------------
  describe('getWeekNumber', () => {
    it('Jan 1 2026 is in week 1', () => {
      // Jan 1 2026 is a Thursday → week 1
      expect(getWeekNumber(adapter, new Date(2026, 0, 1))).toBe(1)
    })

    it('Dec 31 2026 is in week 53', () => {
      // Dec 31 2026 is a Thursday → week 53
      expect(getWeekNumber(adapter, new Date(2026, 11, 31))).toBe(53)
    })

    it('March 17 2026 (Tuesday) is in week 12', () => {
      expect(getWeekNumber(adapter, new Date(2026, 2, 17))).toBe(12)
    })

    it('returns a number between 1 and 53', () => {
      // check every Monday in 2026
      let d = new Date(2026, 0, 5) // first Monday
      while (d.getFullYear() === 2026) {
        const wn = getWeekNumber(adapter, d)
        expect(wn).toBeGreaterThanOrEqual(1)
        expect(wn).toBeLessThanOrEqual(53)
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
      }
    })
  })
})
