import { beforeEach, describe, expect, it } from 'vitest'
import { NativeAdapter } from '../../adapter'
import { buildCalendarMonth } from '../../grid'
import { applySelection, selectDay } from '../selection'
import { isDateDisabled, isInRange } from '../selection.libs'
import type { DateRange } from '../selection.types'

describe('selection', () => {
  let adapter: NativeAdapter
  const march2026 = new Date(2026, 2, 1)
  const baseConfig = { showOutsideDays: true, fixedWeeks: false, locale: { weekStartDay: 0 as const } }

  beforeEach(() => {
    adapter = new NativeAdapter()
  })

  // ---------------------------------------------------------------------------
  // selectDay — single
  // ---------------------------------------------------------------------------
  describe('selectDay / single', () => {
    it('selects a date when nothing is selected', () => {
      const result = selectDay(adapter, 'single', null, adapter.create(2026, 2, 15))
      expect(result).not.toBeNull()
      expect(adapter.isSameDay(result as Date, adapter.create(2026, 2, 15))).toBe(true)
    })

    it('deselects when the same date is clicked again', () => {
      const date = adapter.create(2026, 2, 15)
      const after = selectDay(adapter, 'single', date, date)
      expect(after).toBeNull()
    })

    it('replaces the selection when a different date is clicked', () => {
      const first = adapter.create(2026, 2, 15)
      const second = adapter.create(2026, 2, 20)
      const result = selectDay(adapter, 'single', first, second)
      expect(adapter.isSameDay(result as Date, second)).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // selectDay — range
  // ---------------------------------------------------------------------------
  describe('selectDay / range', () => {
    it('1st click sets from, to is null', () => {
      const result = selectDay(adapter, 'range', null, adapter.create(2026, 2, 10)) as DateRange<Date>
      expect(result).not.toBeNull()
      expect(adapter.isSameDay(result.from, adapter.create(2026, 2, 10))).toBe(true)
      expect(result.to).toBeNull()
    })

    it('2nd click sets to', () => {
      const partial: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: null }
      const result = selectDay(adapter, 'range', partial, adapter.create(2026, 2, 20)) as DateRange<Date>
      expect(adapter.isSameDay(result.from, adapter.create(2026, 2, 10))).toBe(true)
      expect(adapter.isSameDay(result.to!, adapter.create(2026, 2, 20))).toBe(true)
    })

    it('auto-swaps when 2nd click is before from', () => {
      const partial: DateRange<Date> = { from: adapter.create(2026, 2, 20), to: null }
      const result = selectDay(adapter, 'range', partial, adapter.create(2026, 2, 5)) as DateRange<Date>
      expect(adapter.isSameDay(result.from, adapter.create(2026, 2, 5))).toBe(true)
      expect(adapter.isSameDay(result.to!, adapter.create(2026, 2, 20))).toBe(true)
    })

    it('3rd click (complete range) resets to new from', () => {
      const complete: DateRange<Date> = {
        from: adapter.create(2026, 2, 10),
        to: adapter.create(2026, 2, 20),
      }
      const result = selectDay(adapter, 'range', complete, adapter.create(2026, 2, 15)) as DateRange<Date>
      expect(adapter.isSameDay(result.from, adapter.create(2026, 2, 15))).toBe(true)
      expect(result.to).toBeNull()
    })

    it('clicking same day as from deselects the range', () => {
      const partial: DateRange<Date> = { from: adapter.create(2026, 2, 15), to: null }
      const result = selectDay(adapter, 'range', partial, adapter.create(2026, 2, 15))
      expect(result).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // selectDay — multi
  // ---------------------------------------------------------------------------
  describe('selectDay / multi', () => {
    it('adds a date to an empty array', () => {
      const result = selectDay(adapter, 'multi', [], adapter.create(2026, 2, 15)) as Date[]
      expect(result).toHaveLength(1)
      expect(adapter.isSameDay(result[0]!, adapter.create(2026, 2, 15))).toBe(true)
    })

    it('adds a second distinct date', () => {
      const existing = [adapter.create(2026, 2, 15)]
      const result = selectDay(adapter, 'multi', existing, adapter.create(2026, 2, 20)) as Date[]
      expect(result).toHaveLength(2)
    })

    it('removes a date that is already selected', () => {
      const existing = [adapter.create(2026, 2, 15), adapter.create(2026, 2, 20)]
      const result = selectDay(adapter, 'multi', existing, adapter.create(2026, 2, 15)) as Date[]
      expect(result).toHaveLength(1)
      expect(adapter.isSameDay(result[0]!, adapter.create(2026, 2, 20))).toBe(true)
    })

    it('does not add duplicates', () => {
      const existing = [adapter.create(2026, 2, 15)]
      const result = selectDay(adapter, 'multi', existing, adapter.create(2026, 2, 15)) as Date[]
      expect(result).toHaveLength(0) // toggled off
    })

    it('does not mutate the original array', () => {
      const existing = [adapter.create(2026, 2, 15)]
      selectDay(adapter, 'multi', existing, adapter.create(2026, 2, 20))
      expect(existing).toHaveLength(1)
    })
  })

  // ---------------------------------------------------------------------------
  // isInRange
  // ---------------------------------------------------------------------------
  describe('isInRange', () => {
    it('returns false when to is null', () => {
      expect(isInRange(adapter, adapter.create(2026, 2, 15), { from: adapter.create(2026, 2, 10), to: null })).toBe(
        false,
      )
    })

    it('returns true for the start date (inclusive)', () => {
      const range: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: adapter.create(2026, 2, 20) }
      expect(isInRange(adapter, adapter.create(2026, 2, 10), range)).toBe(true)
    })

    it('returns true for the end date (inclusive)', () => {
      const range: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: adapter.create(2026, 2, 20) }
      expect(isInRange(adapter, adapter.create(2026, 2, 20), range)).toBe(true)
    })

    it('returns true for a date in the middle', () => {
      const range: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: adapter.create(2026, 2, 20) }
      expect(isInRange(adapter, adapter.create(2026, 2, 15), range)).toBe(true)
    })

    it('returns false for a date before the range', () => {
      const range: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: adapter.create(2026, 2, 20) }
      expect(isInRange(adapter, adapter.create(2026, 2, 9), range)).toBe(false)
    })

    it('returns false for a date after the range', () => {
      const range: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: adapter.create(2026, 2, 20) }
      expect(isInRange(adapter, adapter.create(2026, 2, 21), range)).toBe(false)
    })

    it('normalises reversed range (from > to)', () => {
      const reversed: DateRange<Date> = { from: adapter.create(2026, 2, 20), to: adapter.create(2026, 2, 10) }
      expect(isInRange(adapter, adapter.create(2026, 2, 15), reversed)).toBe(true)
      expect(isInRange(adapter, adapter.create(2026, 2, 9), reversed)).toBe(false)
    })
  })

  // ---------------------------------------------------------------------------
  // isDateDisabled
  // ---------------------------------------------------------------------------
  describe('isDateDisabled', () => {
    it('returns false with empty constraints', () => {
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), {})).toBe(false)
    })

    it('returns true when date is in disabled array', () => {
      const constraints = { disabled: [adapter.create(2026, 2, 15)] }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(true)
    })

    it('returns false when date is not in disabled array', () => {
      const constraints = { disabled: [adapter.create(2026, 2, 16)] }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(false)
    })

    it('returns true when predicate returns true', () => {
      const constraints = { disabled: (d: Date) => d.getDay() === 0 } // disable Sundays
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(true) // Mar 15 = Sunday
    })

    it('returns false when predicate returns false', () => {
      const constraints = { disabled: (d: Date) => d.getDay() === 0 }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 16), constraints)).toBe(false) // Monday
    })

    it('returns true when date is before fromDate', () => {
      const constraints = { fromDate: adapter.create(2026, 2, 15) }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 14), constraints)).toBe(true)
    })

    it('returns false when date equals fromDate', () => {
      const constraints = { fromDate: adapter.create(2026, 2, 15) }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(false)
    })

    it('returns true when date is after toDate', () => {
      const constraints = { toDate: adapter.create(2026, 2, 15) }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 16), constraints)).toBe(true)
    })

    it('returns false when date equals toDate', () => {
      const constraints = { toDate: adapter.create(2026, 2, 15) }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(false)
    })

    it('applies all constraints — disabled array + fromDate', () => {
      const constraints = {
        disabled: [adapter.create(2026, 2, 10)],
        fromDate: adapter.create(2026, 2, 5),
      }
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 3), constraints)).toBe(true) // before fromDate
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 10), constraints)).toBe(true) // in disabled list
      expect(isDateDisabled(adapter, adapter.create(2026, 2, 15), constraints)).toBe(false) // fine
    })
  })

  // ---------------------------------------------------------------------------
  // applySelection
  // ---------------------------------------------------------------------------
  describe('applySelection', () => {
    it('sets isSelected for a single selected date', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const selected = adapter.create(2026, 2, 15)
      const result = applySelection(grid.weeks, adapter, 'single', selected)

      const allDays = result.flatMap((w) => w.days)
      const selectedDays = allDays.filter((d) => d.isSelected)
      expect(selectedDays).toHaveLength(1)
      expect(adapter.isSameDay(selectedDays[0]!.date, selected)).toBe(true)
    })

    it('sets isSelected for all multi-selected dates', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const selected = [adapter.create(2026, 2, 5), adapter.create(2026, 2, 15), adapter.create(2026, 2, 25)]
      const result = applySelection(grid.weeks, adapter, 'multi', selected)

      const allDays = result.flatMap((w) => w.days)
      const selectedDays = allDays.filter((d) => d.isSelected)
      expect(selectedDays).toHaveLength(3)
    })

    it('sets range flags correctly', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const selected: DateRange<Date> = {
        from: adapter.create(2026, 2, 10),
        to: adapter.create(2026, 2, 15),
      }
      const result = applySelection(grid.weeks, adapter, 'range', selected)
      const allDays = result.flatMap((w) => w.days)

      const startDay = allDays.find((d) => adapter.isSameDay(d.date, adapter.create(2026, 2, 10)))!
      const endDay = allDays.find((d) => adapter.isSameDay(d.date, adapter.create(2026, 2, 15)))!
      const midDay = allDays.find((d) => adapter.isSameDay(d.date, adapter.create(2026, 2, 12)))!

      expect(startDay.isRangeStart).toBe(true)
      expect(startDay.isSelected).toBe(true)
      expect(endDay.isRangeEnd).toBe(true)
      expect(endDay.isSelected).toBe(true)
      expect(midDay.isRangeMiddle).toBe(true)
      expect(midDay.isSelected).toBe(false)
    })

    it('sets isDisabled for dates outside constraints', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const result = applySelection(grid.weeks, adapter, 'single', null, {
        fromDate: adapter.create(2026, 2, 15),
      })
      const allDays = result.flatMap((w) => w.days).filter((d) => !d.isOutside)
      const disabledDays = allDays.filter((d) => d.isDisabled)
      // days 1–14 should be disabled
      expect(disabledDays.length).toBe(14)
    })

    it('does not mutate the original weeks', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const originalFirstDay = grid.weeks[0]!.days[0]!.isSelected
      applySelection(grid.weeks, adapter, 'single', adapter.create(2026, 2, 1))
      expect(grid.weeks[0]!.days[0]!.isSelected).toBe(originalFirstDay)
    })

    it('range with null selected returns no range flags', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const result = applySelection(grid.weeks, adapter, 'range', null)
      const allDays = result.flatMap((w) => w.days)
      expect(allDays.every((d) => !d.isRangeStart && !d.isRangeEnd && !d.isRangeMiddle)).toBe(true)
    })

    it('partial range (to=null) sets only isRangeStart', () => {
      const grid = buildCalendarMonth(adapter, march2026, baseConfig)
      const selected: DateRange<Date> = { from: adapter.create(2026, 2, 10), to: null }
      const result = applySelection(grid.weeks, adapter, 'range', selected)
      const allDays = result.flatMap((w) => w.days)

      const startDay = allDays.find((d) => adapter.isSameDay(d.date, adapter.create(2026, 2, 10)))!
      expect(startDay.isRangeStart).toBe(true)
      expect(startDay.isSelected).toBe(true)
      expect(allDays.every((d) => !d.isRangeMiddle && !d.isRangeEnd)).toBe(true)
    })
  })
})
