import { beforeEach, describe, expect, it } from 'vitest'

import { DateFnsAdapter } from '../date-fns-adapter'

describe('DateFnsAdapter', () => {
  let adapter: DateFnsAdapter

  beforeEach(() => {
    adapter = new DateFnsAdapter()
  })

  describe('today', () => {
    it('returns a Date', () => {
      expect(adapter.today()).toBeInstanceOf(Date)
    })

    it('has time stripped to midnight', () => {
      const t = adapter.today()
      expect(t.getHours()).toBe(0)
      expect(t.getMinutes()).toBe(0)
      expect(t.getSeconds()).toBe(0)
      expect(t.getMilliseconds()).toBe(0)
    })

    it('matches the current calendar date', () => {
      const now = new Date()
      const t = adapter.today()
      expect(t.getFullYear()).toBe(now.getFullYear())
      expect(t.getMonth()).toBe(now.getMonth())
      expect(t.getDate()).toBe(now.getDate())
    })
  })

  describe('create', () => {
    it('creates a date from parts', () => {
      const d = adapter.create(2026, 2, 17) // March 17 2026
      expect(d.getFullYear()).toBe(2026)
      expect(d.getMonth()).toBe(2)
      expect(d.getDate()).toBe(17)
    })

    it('strips time to midnight', () => {
      const d = adapter.create(2026, 0, 1)
      expect(d.getHours()).toBe(0)
      expect(d.getMilliseconds()).toBe(0)
    })

    it('handles month boundaries (0 = Jan, 11 = Dec)', () => {
      expect(adapter.create(2026, 0, 1).getMonth()).toBe(0)
      expect(adapter.create(2026, 11, 31).getMonth()).toBe(11)
    })
  })

  describe('isValid', () => {
    it('returns true for a valid date', () => {
      expect(adapter.isValid(adapter.create(2026, 2, 17))).toBe(true)
    })

    it('returns false for an invalid date', () => {
      expect(adapter.isValid(new Date('not a date'))).toBe(false)
    })
  })

  describe('isSameDay', () => {
    it('returns true for the same calendar day', () => {
      const a = adapter.create(2026, 2, 17)
      const b = adapter.create(2026, 2, 17)
      expect(adapter.isSameDay(a, b)).toBe(true)
    })

    it('returns true regardless of time component', () => {
      const a = new Date(2026, 2, 17, 8, 0, 0)
      const b = new Date(2026, 2, 17, 23, 59, 59)
      expect(adapter.isSameDay(a, b)).toBe(true)
    })

    it('returns false for different days', () => {
      expect(adapter.isSameDay(adapter.create(2026, 2, 17), adapter.create(2026, 2, 18))).toBe(false)
    })

    it('returns false for same day different month', () => {
      expect(adapter.isSameDay(adapter.create(2026, 2, 17), adapter.create(2026, 3, 17))).toBe(false)
    })

    it('returns false for same day different year', () => {
      expect(adapter.isSameDay(adapter.create(2026, 2, 17), adapter.create(2025, 2, 17))).toBe(false)
    })
  })

  describe('isSameMonth', () => {
    it('returns true for dates in the same month', () => {
      expect(adapter.isSameMonth(adapter.create(2026, 2, 1), adapter.create(2026, 2, 31))).toBe(true)
    })

    it('returns false for different months', () => {
      expect(adapter.isSameMonth(adapter.create(2026, 2, 17), adapter.create(2026, 3, 17))).toBe(false)
    })

    it('returns false for same month different year', () => {
      expect(adapter.isSameMonth(adapter.create(2026, 2, 17), adapter.create(2025, 2, 17))).toBe(false)
    })
  })

  describe('isBefore', () => {
    it('returns true when a is before b', () => {
      expect(adapter.isBefore(adapter.create(2026, 0, 1), adapter.create(2026, 0, 2))).toBe(true)
    })

    it('returns false when a equals b', () => {
      const d = adapter.create(2026, 0, 1)
      expect(adapter.isBefore(d, d)).toBe(false)
    })

    it('returns false when a is after b', () => {
      expect(adapter.isBefore(adapter.create(2026, 0, 2), adapter.create(2026, 0, 1))).toBe(false)
    })
  })

  describe('isAfter', () => {
    it('returns true when a is after b', () => {
      expect(adapter.isAfter(adapter.create(2026, 0, 2), adapter.create(2026, 0, 1))).toBe(true)
    })

    it('returns false when a equals b', () => {
      const d = adapter.create(2026, 0, 1)
      expect(adapter.isAfter(d, d)).toBe(false)
    })

    it('returns false when a is before b', () => {
      expect(adapter.isAfter(adapter.create(2026, 0, 1), adapter.create(2026, 0, 2))).toBe(false)
    })
  })

  describe('startOfMonth', () => {
    it('returns the 1st of the month', () => {
      const d = adapter.startOfMonth(adapter.create(2026, 2, 17))
      expect(d.getDate()).toBe(1)
      expect(d.getMonth()).toBe(2)
      expect(d.getFullYear()).toBe(2026)
    })

    it('is already the 1st  -  returns 1st', () => {
      expect(adapter.startOfMonth(adapter.create(2026, 2, 1)).getDate()).toBe(1)
    })
  })

  describe('endOfMonth', () => {
    it('returns the last day of a 31-day month', () => {
      expect(adapter.endOfMonth(adapter.create(2026, 2, 1)).getDate()).toBe(31) // March
    })

    it('returns the last day of a 30-day month', () => {
      expect(adapter.endOfMonth(adapter.create(2026, 3, 1)).getDate()).toBe(30) // April
    })

    it('returns 28 for February in a non-leap year', () => {
      expect(adapter.endOfMonth(adapter.create(2026, 1, 1)).getDate()).toBe(28)
    })

    it('returns 29 for February in a leap year', () => {
      expect(adapter.endOfMonth(adapter.create(2024, 1, 1)).getDate()).toBe(29)
    })
  })

  describe('startOfWeek', () => {
    // 2026-03-17 is a Tuesday (getDay() = 2)
    const tuesday = new Date(2026, 2, 17)

    it('walks back to Sunday when weekStartDay=0', () => {
      const d = adapter.startOfWeek(tuesday, 0)
      expect(d.getDay()).toBe(0)
      expect(d.getDate()).toBe(15) // Mar 15
    })

    it('walks back to Monday when weekStartDay=1', () => {
      const d = adapter.startOfWeek(tuesday, 1)
      expect(d.getDay()).toBe(1)
      expect(d.getDate()).toBe(16) // Mar 16
    })

    it('returns same day when date is already the start day', () => {
      const monday = adapter.create(2026, 2, 16) // Monday
      const d = adapter.startOfWeek(monday, 1)
      expect(d.getDate()).toBe(16)
    })

    it('handles Sunday with weekStartDay=1 (walks back 6 days)', () => {
      const sunday = adapter.create(2026, 2, 15) // Sunday Mar 15
      const d = adapter.startOfWeek(sunday, 1)
      expect(d.getDate()).toBe(9) // Mon Mar 9
    })
  })

  describe('addDays', () => {
    it('adds positive days', () => {
      const d = adapter.addDays(adapter.create(2026, 2, 17), 5)
      expect(d.getDate()).toBe(22)
    })

    it('subtracts days with negative count', () => {
      const d = adapter.addDays(adapter.create(2026, 2, 17), -5)
      expect(d.getDate()).toBe(12)
    })

    it('crosses month boundary', () => {
      const d = adapter.addDays(adapter.create(2026, 2, 30), 2) // Mar 30 + 2 = Apr 1
      expect(d.getMonth()).toBe(3)
      expect(d.getDate()).toBe(1)
    })

    it('crosses year boundary', () => {
      const d = adapter.addDays(adapter.create(2026, 11, 31), 1)
      expect(d.getFullYear()).toBe(2027)
      expect(d.getMonth()).toBe(0)
      expect(d.getDate()).toBe(1)
    })

    it('does not mutate the input', () => {
      const original = adapter.create(2026, 2, 17)
      adapter.addDays(original, 10)
      expect(original.getDate()).toBe(17)
    })
  })

  describe('addMonths', () => {
    it('adds months', () => {
      const d = adapter.addMonths(adapter.create(2026, 0, 15), 2)
      expect(d.getMonth()).toBe(2)
      expect(d.getDate()).toBe(15)
    })

    it('subtracts months', () => {
      const d = adapter.addMonths(adapter.create(2026, 2, 15), -2)
      expect(d.getMonth()).toBe(0)
    })

    it('clamps Jan 31 + 1 month to Feb 28', () => {
      const d = adapter.addMonths(adapter.create(2026, 0, 31), 1)
      expect(d.getMonth()).toBe(1)
      expect(d.getDate()).toBe(28)
    })

    it('clamps Jan 31 + 1 month to Feb 29 in a leap year', () => {
      const d = adapter.addMonths(adapter.create(2024, 0, 31), 1)
      expect(d.getMonth()).toBe(1)
      expect(d.getDate()).toBe(29)
    })

    it('crosses year boundary', () => {
      const d = adapter.addMonths(adapter.create(2026, 11, 1), 1)
      expect(d.getFullYear()).toBe(2027)
      expect(d.getMonth()).toBe(0)
    })

    it('does not mutate the input', () => {
      const original = adapter.create(2026, 0, 31)
      adapter.addMonths(original, 1)
      expect(original.getMonth()).toBe(0)
      expect(original.getDate()).toBe(31)
    })
  })

  describe('addYears', () => {
    it('adds years', () => {
      const d = adapter.addYears(adapter.create(2026, 2, 17), 2)
      expect(d.getFullYear()).toBe(2028)
      expect(d.getMonth()).toBe(2)
      expect(d.getDate()).toBe(17)
    })

    it('subtracts years', () => {
      const d = adapter.addYears(adapter.create(2026, 2, 17), -1)
      expect(d.getFullYear()).toBe(2025)
    })

    it('clamps Feb 29 leap to Feb 28 non-leap', () => {
      const d = adapter.addYears(adapter.create(2024, 1, 29), 1)
      expect(d.getFullYear()).toBe(2025)
      expect(d.getMonth()).toBe(1)
      expect(d.getDate()).toBe(28)
    })

    it('keeps Feb 29 when target is also a leap year', () => {
      const d = adapter.addYears(adapter.create(2024, 1, 29), 4)
      expect(d.getFullYear()).toBe(2028)
      expect(d.getDate()).toBe(29)
    })

    it('does not mutate the input', () => {
      const original = adapter.create(2024, 1, 29)
      adapter.addYears(original, 1)
      expect(original.getFullYear()).toBe(2024)
      expect(original.getDate()).toBe(29)
    })
  })

  describe('getYear', () => {
    it('returns the full year', () => {
      expect(adapter.getYear(adapter.create(2026, 2, 17))).toBe(2026)
    })
  })

  describe('getMonth', () => {
    it('returns 0-indexed month', () => {
      expect(adapter.getMonth(adapter.create(2026, 0, 1))).toBe(0) // Jan
      expect(adapter.getMonth(adapter.create(2026, 11, 1))).toBe(11) // Dec
    })
  })

  describe('getDate', () => {
    it('returns day of month', () => {
      expect(adapter.getDate(adapter.create(2026, 2, 17))).toBe(17)
    })
  })

  describe('getDayOfWeek', () => {
    it('returns 2 for Tuesday March 17 2026', () => {
      expect(adapter.getDayOfWeek(adapter.create(2026, 2, 17))).toBe(2)
    })

    it('returns 0 for Sunday', () => {
      expect(adapter.getDayOfWeek(adapter.create(2026, 2, 15))).toBe(0)
    })

    it('returns 6 for Saturday', () => {
      expect(adapter.getDayOfWeek(adapter.create(2026, 2, 14))).toBe(6)
    })
  })

  describe('toDate', () => {
    it('returns a new Date instance', () => {
      const original = adapter.create(2026, 2, 17)
      const result = adapter.toDate(original)
      expect(result).not.toBe(original)
      expect(result.getTime()).toBe(original.getTime())
    })
  })

  describe('fromDate', () => {
    it('strips time from a Date with time set', () => {
      const d = new Date(2026, 2, 17, 14, 30, 45, 500)
      const result = adapter.fromDate(d)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
      expect(result.getMilliseconds()).toBe(0)
    })

    it('preserves the calendar date', () => {
      const d = new Date(2026, 2, 17, 23, 59)
      const result = adapter.fromDate(d)
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(17)
    })

    it('does not return the same reference', () => {
      const d = new Date(2026, 2, 17)
      expect(adapter.fromDate(d)).not.toBe(d)
    })
  })

  describe('format', () => {
    const d = new Date(2026, 2, 17)

    it('formats with provided options', () => {
      const result = adapter.format(d, { year: 'numeric', month: 'long' }, 'en-US')
      expect(result).toBe('March 2026')
    })

    it('formats day with numeric option', () => {
      const result = adapter.format(d, { day: 'numeric' }, 'en-US')
      expect(result).toBe('17')
    })

    it('uses runtime locale when locale is omitted', () => {
      expect(typeof adapter.format(d, { month: 'short' })).toBe('string')
    })
  })

  describe('getHours', () => {
    it('returns the hour', () => {
      const d = new Date(2026, 2, 17, 14, 30, 45)
      expect(adapter.getHours(d)).toBe(14)
    })
  })

  describe('getMinutes', () => {
    it('returns the minute', () => {
      const d = new Date(2026, 2, 17, 14, 30, 45)
      expect(adapter.getMinutes(d)).toBe(30)
    })
  })

  describe('getSeconds', () => {
    it('returns the second', () => {
      const d = new Date(2026, 2, 17, 14, 30, 45)
      expect(adapter.getSeconds(d)).toBe(45)
    })
  })

  describe('setTime', () => {
    it('sets hour, minute, and second', () => {
      const d = adapter.create(2026, 2, 17)
      const result = adapter.setTime(d, 14, 30, 45)
      expect(result.getHours()).toBe(14)
      expect(result.getMinutes()).toBe(30)
      expect(result.getSeconds()).toBe(45)
    })

    it('preserves the date', () => {
      const d = adapter.create(2026, 2, 17)
      const result = adapter.setTime(d, 10, 0)
      expect(result.getFullYear()).toBe(2026)
      expect(result.getMonth()).toBe(2)
      expect(result.getDate()).toBe(17)
    })

    it('defaults second to 0 when omitted', () => {
      const d = adapter.create(2026, 2, 17)
      const result = adapter.setTime(d, 14, 30)
      expect(result.getSeconds()).toBe(0)
    })

    it('does not mutate the input', () => {
      const original = adapter.create(2026, 2, 17)
      adapter.setTime(original, 14, 30, 45)
      expect(original.getHours()).toBe(0)
    })
  })
})
