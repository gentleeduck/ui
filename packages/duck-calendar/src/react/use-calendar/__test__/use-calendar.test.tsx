import { act, renderHook } from '@testing-library/react'
import { NativeAdapter } from '../../../adapter'
import type { DateRange } from '../../../selection'
import { useCalendar } from '../use-calendar'

const march2026 = new Date(2026, 2, 1)

describe('useCalendar', () => {
  let adapter: NativeAdapter

  beforeEach(() => {
    adapter = new NativeAdapter()
  })

  // ---------------------------------------------------------------------------
  // Uncontrolled month
  // ---------------------------------------------------------------------------
  describe('uncontrolled month', () => {
    it('defaults to today when no defaultMonth provided', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const }))
      const today = adapter.today()
      expect(adapter.isSameMonth(result.current.state.month, today)).toBe(true)
    })

    it('uses defaultMonth when provided', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))
      expect(adapter.isSameMonth(result.current.state.month, march2026)).toBe(true)
    })

    it('goToNext() advances month by 1', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      act(() => {
        result.current.actions.goToNext()
      })

      expect(result.current.state.month.getMonth()).toBe(3) // April
      expect(result.current.state.month.getFullYear()).toBe(2026)
    })

    it('goToPrevious() goes back 1 month', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      act(() => {
        result.current.actions.goToPrevious()
      })

      expect(result.current.state.month.getMonth()).toBe(1) // February
      expect(result.current.state.month.getFullYear()).toBe(2026)
    })
  })

  // ---------------------------------------------------------------------------
  // Controlled month
  // ---------------------------------------------------------------------------
  describe('controlled month', () => {
    it('uses month prop as the displayed month', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, month: march2026 }))
      expect(adapter.isSameMonth(result.current.state.month, march2026)).toBe(true)
    })

    it('onMonthChange is called when navigating', () => {
      const onMonthChange = vi.fn()
      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          month: march2026,
          onMonthChange,
        }),
      )

      act(() => {
        result.current.actions.goToNext()
      })

      expect(onMonthChange).toHaveBeenCalledOnce()
      const nextMonth = onMonthChange.mock.calls[0][0] as Date
      expect(nextMonth.getMonth()).toBe(3) // April
    })
  })

  // ---------------------------------------------------------------------------
  // Single selection
  // ---------------------------------------------------------------------------
  describe('single selection', () => {
    it('initial value is null', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))
      expect(result.current.state.value).toBeNull()
    })

    it('selectDate(date) selects the date', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
      act(() => {
        result.current.actions.selectDate(day.date)
      })

      expect(adapter.isSameDay(result.current.state.value as Date, day.date)).toBe(true)
    })

    it('selectDate(same) deselects (toggles off)', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
      act(() => {
        result.current.actions.selectDate(day.date)
      })
      act(() => {
        result.current.actions.selectDate(day.date)
      })

      expect(result.current.state.value).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // Range selection
  // ---------------------------------------------------------------------------
  describe('range selection', () => {
    it('first click sets from, to is null', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'range' as const, defaultMonth: march2026 }))

      const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
      act(() => {
        result.current.actions.selectDate(day.date)
      })

      const range = result.current.state.value as DateRange<Date>
      expect(range).not.toBeNull()
      expect(adapter.isSameDay(range.from, day.date)).toBe(true)
      expect(range.to).toBeNull()
    })

    it('second click sets to', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'range' as const, defaultMonth: march2026 }))

      const firstDay = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
      const lastDay = result.current.state.weeks[2]!.days.find((d) => !d.isOutside)!

      act(() => {
        result.current.actions.selectDate(firstDay.date)
      })
      act(() => {
        result.current.actions.selectDate(lastDay.date)
      })

      const range = result.current.state.value as DateRange<Date>
      expect(range).not.toBeNull()
      expect(adapter.isSameDay(range.from, firstDay.date)).toBe(true)
      expect(range.to).not.toBeNull()
      expect(adapter.isSameDay(range.to!, lastDay.date)).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Multi selection
  // ---------------------------------------------------------------------------
  describe('multi selection', () => {
    it('initial value is empty array', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'multi' as const, defaultMonth: march2026 }))
      expect(result.current.state.value).toEqual([])
    })

    it('click toggles date in/out of array', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'multi' as const, defaultMonth: march2026 }))

      const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!

      // Toggle in
      act(() => {
        result.current.actions.selectDate(day.date)
      })

      const selected = result.current.state.value as Date[]
      expect(selected).toHaveLength(1)
      expect(adapter.isSameDay(selected[0]!, day.date)).toBe(true)

      // Toggle out
      act(() => {
        result.current.actions.selectDate(day.date)
      })

      expect(result.current.state.value).toEqual([])
    })
  })

  // ---------------------------------------------------------------------------
  // Disabled dates
  // ---------------------------------------------------------------------------
  describe('disabled dates', () => {
    it('selectDate on a disabled date does NOT change value', () => {
      const march5 = new Date(2026, 2, 5)

      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          disabled: [march5],
        }),
      )

      act(() => {
        result.current.actions.selectDate(march5)
      })

      expect(result.current.state.value).toBeNull()
    })

    it('selectDate on a disabled date (predicate) does NOT change value', () => {
      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          disabled: (date: Date) => date.getDate() === 10,
        }),
      )

      const march10 = new Date(2026, 2, 10)
      act(() => {
        result.current.actions.selectDate(march10)
      })

      expect(result.current.state.value).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // Navigation constraints
  // ---------------------------------------------------------------------------
  describe('navigation constraints', () => {
    it('canGoNext is false when at toDate boundary', () => {
      const toDate = new Date(2026, 2, 31) // March 31

      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          toDate,
        }),
      )

      expect(result.current.state.canGoNext).toBe(false)
    })

    it('canGoPrevious is false when at fromDate boundary', () => {
      const fromDate = new Date(2026, 2, 1) // March 1

      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          fromDate,
        }),
      )

      expect(result.current.state.canGoPrevious).toBe(false)
    })

    it('goToNext() does nothing when canGoNext is false', () => {
      const toDate = new Date(2026, 2, 31) // March 31

      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          toDate,
        }),
      )

      act(() => {
        result.current.actions.goToNext()
      })

      expect(adapter.isSameMonth(result.current.state.month, march2026)).toBe(true)
    })

    it('goToPrevious() does nothing when canGoPrevious is false', () => {
      const fromDate = new Date(2026, 2, 1)

      const { result } = renderHook(() =>
        useCalendar({
          adapter,
          mode: 'single' as const,
          defaultMonth: march2026,
          fromDate,
        }),
      )

      act(() => {
        result.current.actions.goToPrevious()
      })

      expect(adapter.isSameMonth(result.current.state.month, march2026)).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Prop getters
  // ---------------------------------------------------------------------------
  describe('prop getters', () => {
    describe('getDayProps', () => {
      it('returns role gridcell', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const day = result.current.state.weeks[0]!.days[0]!
        const props = result.current.getDayProps(day)

        expect(props.role).toBe('gridcell')
      })

      it('returns correct aria-selected (false when not selected)', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
        const props = result.current.getDayProps(day)

        expect(props['aria-selected']).toBe(false)
      })

      it('returns correct aria-selected (true when selected)', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const day = result.current.state.weeks[0]!.days.find((d) => !d.isOutside)!
        act(() => {
          result.current.actions.selectDate(day.date)
        })

        // After selection, the day in weeks is updated — re-find it
        const updatedDay = result.current.state.weeks[0]!.days.find((d) => adapter.isSameDay(d.date, day.date))!
        const props = result.current.getDayProps(updatedDay)

        expect(props['aria-selected']).toBe(true)
      })

      it('returns aria-disabled for disabled dates', () => {
        const march5 = new Date(2026, 2, 5)

        const { result } = renderHook(() =>
          useCalendar({
            adapter,
            mode: 'single' as const,
            defaultMonth: march2026,
            disabled: [march5],
          }),
        )

        const day = result.current.state.weeks.flatMap((w) => w.days).find((d) => adapter.isSameDay(d.date, march5))!
        const props = result.current.getDayProps(day)

        expect(props['aria-disabled']).toBe(true)
      })

      it('returns tabIndex 0 for focused date and -1 for others', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const focusedDate = result.current.state.focusedDate
        const allDays = result.current.state.weeks.flatMap((w) => w.days)

        const focusedDay = allDays.find((d) => adapter.isSameDay(d.date, focusedDate))
        const otherDay = allDays.find((d) => !adapter.isSameDay(d.date, focusedDate))

        if (focusedDay) {
          expect(result.current.getDayProps(focusedDay).tabIndex).toBe(0)
        }
        if (otherDay) {
          expect(result.current.getDayProps(otherDay).tabIndex).toBe(-1)
        }
      })

      it('returns data-calendar-day attribute', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const day = result.current.state.weeks[0]!.days[0]!
        const props = result.current.getDayProps(day)

        expect(props['data-calendar-day']).toBe('')
      })

      it('returns data-outside-month for outside days', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const outsideDay = result.current.state.weeks.flatMap((w) => w.days).find((d) => d.isOutside)

        if (outsideDay) {
          const props = result.current.getDayProps(outsideDay)
          expect(props['data-outside-month']).toBe('true')
        }
      })

      it('returns onClick and onKeyDown handlers', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const day = result.current.state.weeks[0]!.days[0]!
        const props = result.current.getDayProps(day)

        expect(typeof props.onClick).toBe('function')
        expect(typeof props.onKeyDown).toBe('function')
      })
    })

    describe('getGridProps', () => {
      it('returns role grid and aria-labelledby', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const props = result.current.getGridProps()

        expect(props.role).toBe('grid')
        expect(typeof props['aria-labelledby']).toBe('string')
        expect(props['aria-labelledby'].length).toBeGreaterThan(0)
      })
    })

    describe('getNavProps', () => {
      it('prev returns aria-label Go to previous month', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const props = result.current.getNavProps('prev')

        expect(props['aria-label']).toBe('Go to previous month')
        expect(typeof props.disabled).toBe('boolean')
        expect(typeof props.onClick).toBe('function')
      })

      it('next returns aria-label Go to next month', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const props = result.current.getNavProps('next')

        expect(props['aria-label']).toBe('Go to next month')
      })

      it('prev disabled when at fromDate boundary', () => {
        const { result } = renderHook(() =>
          useCalendar({
            adapter,
            mode: 'single' as const,
            defaultMonth: march2026,
            fromDate: new Date(2026, 2, 1),
          }),
        )

        const props = result.current.getNavProps('prev')
        expect(props.disabled).toBe(true)
      })

      it('next disabled when at toDate boundary', () => {
        const { result } = renderHook(() =>
          useCalendar({
            adapter,
            mode: 'single' as const,
            defaultMonth: march2026,
            toDate: new Date(2026, 2, 31),
          }),
        )

        const props = result.current.getNavProps('next')
        expect(props.disabled).toBe(true)
      })
    })

    describe('getHeaderProps', () => {
      it('returns id and aria-live polite', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const props = result.current.getHeaderProps()

        expect(typeof props.id).toBe('string')
        expect(props.id.length).toBeGreaterThan(0)
        expect(props['aria-live']).toBe('polite')
      })

      it('header id matches grid aria-labelledby', () => {
        const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

        const headerProps = result.current.getHeaderProps()
        const gridProps = result.current.getGridProps()

        expect(gridProps['aria-labelledby']).toBe(headerProps.id)
      })
    })
  })

  // ---------------------------------------------------------------------------
  // State shape
  // ---------------------------------------------------------------------------
  describe('state shape', () => {
    it('state.weeks is an array of CalendarWeek objects', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      expect(Array.isArray(result.current.state.weeks)).toBe(true)
      expect(result.current.state.weeks.length).toBeGreaterThan(0)

      for (const week of result.current.state.weeks) {
        expect(week).toHaveProperty('weekNumber')
        expect(week).toHaveProperty('days')
        expect(week.days).toHaveLength(7)
      }
    })

    it('state.weekdays has exactly 7 items', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      expect(result.current.state.weekdays).toHaveLength(7)
      for (const label of result.current.state.weekdays) {
        expect(typeof label).toBe('string')
        expect(label.length).toBeGreaterThan(0)
      }
    })

    it('state.viewMode defaults to days', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      expect(result.current.state.viewMode).toBe('days')
    })

    it('actions.setViewMode(months) changes viewMode', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      act(() => {
        result.current.actions.setViewMode('months')
      })

      expect(result.current.state.viewMode).toBe('months')
    })

    it('actions.setViewMode(years) changes viewMode', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      act(() => {
        result.current.actions.setViewMode('years')
      })

      expect(result.current.state.viewMode).toBe('years')
    })
  })

  // ---------------------------------------------------------------------------
  // Focus
  // ---------------------------------------------------------------------------
  describe('focus', () => {
    it('actions.focusDate(date) changes focusedDate', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      const march15 = new Date(2026, 2, 15)
      act(() => {
        result.current.actions.focusDate(march15)
      })

      expect(adapter.isSameDay(result.current.state.focusedDate, march15)).toBe(true)
    })

    it('focusedDate affects getDayProps tabIndex', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))

      const march15 = new Date(2026, 2, 15)
      act(() => {
        result.current.actions.focusDate(march15)
      })

      const allDays = result.current.state.weeks.flatMap((w) => w.days)

      const focusedDay = allDays.find((d) => adapter.isSameDay(d.date, march15))!
      const otherDay = allDays.find((d) => !adapter.isSameDay(d.date, march15))!

      expect(result.current.getDayProps(focusedDay).tabIndex).toBe(0)
      expect(result.current.getDayProps(otherDay).tabIndex).toBe(-1)
    })

    it('focusedDate defaults to today even when defaultMonth is provided', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const, defaultMonth: march2026 }))
      const today = adapter.today()
      expect(adapter.isSameDay(result.current.state.focusedDate, today)).toBe(true)
    })

    it('focusedDate defaults to selected date when provided', () => {
      const selected = new Date(2026, 2, 15)
      const { result } = renderHook(() =>
        useCalendar({ adapter, mode: 'single' as const, selected, defaultMonth: march2026 }),
      )
      expect(adapter.isSameDay(result.current.state.focusedDate, selected)).toBe(true)
    })

    it('focusedDate defaults to today when no defaultMonth', () => {
      const { result } = renderHook(() => useCalendar({ adapter, mode: 'single' as const }))

      const today = adapter.today()
      expect(adapter.isSameDay(result.current.state.focusedDate, today)).toBe(true)
    })
  })
})
