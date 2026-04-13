import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  buildCalendarMonth,
  buildMultiMonth,
  type ICalendarDay,
  type ICalendarMonth,
  getLocalizedWeekdays,
} from '../../grid'
import type { ViewMode } from '../../index.types'
import { canNavigate, navigate } from '../../navigation'
import type { CalendarValue, DateRange, ISelectionConstraints, SelectionMode } from '../../selection'
import { applySelection, isDateDisabled, selectDay } from '../../selection'
import {
  buildDateDisabledMessage,
  buildDateSelectedMessage,
  buildMonthNavigationMessage,
  buildRangeSelectedMessage,
  useAnnouncer,
} from '../use-announcer'
import { useKeyboard } from '../use-keyboard'
import { useControllableState } from '../utils/use-controllable-state'
import { buildDayProps, buildGridProps, buildHeaderProps, buildNavProps } from './use-calendar.libs'
import type { IUseCalendarConfig, IUseCalendarReturn } from './use-calendar.types'

// ---------------------------------------------------------------------------
// useCalendar
// ---------------------------------------------------------------------------

export function useCalendar<TDate, M extends SelectionMode = 'single'>(
  config: IUseCalendarConfig<TDate, M>,
): IUseCalendarReturn<TDate, M> {
  const {
    adapter,
    mode,
    locale,
    month: controlledMonth,
    defaultMonth,
    selected: controlledSelected,
    defaultSelected,
    onSelect,
    onMonthChange,
    numberOfMonths = 1,
    showOutsideDays = true,
    fixedWeeks = false,
    disabled,
    fromDate,
    toDate,
  } = config

  const headerId = useId()

  // -------------------------------------------------------------------------
  // Screen reader (declared early so `announce` is available to selectDate)
  // -------------------------------------------------------------------------
  const announcer = useAnnouncer()
  const { announce } = announcer

  // -------------------------------------------------------------------------
  // Controlled / uncontrolled month
  // -------------------------------------------------------------------------
  const initialMonth = defaultMonth ?? controlledMonth ?? adapter.today()

  const [month, setMonthState] = useControllableState<TDate>(controlledMonth, initialMonth, onMonthChange)

  // -------------------------------------------------------------------------
  // Controlled / uncontrolled selection value
  // -------------------------------------------------------------------------
  const initialValue: CalendarValue<TDate, M> =
    (defaultSelected as CalendarValue<TDate, M>) ??
    (mode === 'multi' || mode === 'multi-range'
      ? ([] as unknown as CalendarValue<TDate, M>)
      : (null as CalendarValue<TDate, M>))

  const [value, setValue] = useControllableState<CalendarValue<TDate, M>>(controlledSelected, initialValue, onSelect)

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------
  const [focusedDate, setFocusedDate] = useState<TDate>(() => {
    // Focus the selected date if provided
    if (mode === 'single' && controlledSelected != null) {
      return controlledSelected as unknown as TDate
    }
    if (mode === 'single' && defaultSelected != null) {
      return defaultSelected as unknown as TDate
    }
    if (mode === 'range' && controlledSelected != null) {
      const range = controlledSelected as unknown as { from: TDate }
      if (range.from) return range.from
    }
    // Always default to today
    return adapter.today()
  })
  const [viewMode, setViewMode] = useState<ViewMode>('days')

  // -------------------------------------------------------------------------
  // Constraints (memoised to keep a stable reference)
  // -------------------------------------------------------------------------
  const constraints: ISelectionConstraints<TDate> = useMemo(
    () => ({ disabled, fromDate, toDate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fromDate, toDate, disabled],
  )

  const isDisabledFn = useCallback((date: TDate) => isDateDisabled(adapter, date, constraints), [adapter, constraints])

  // Extract primitive values from locale for stable memoization deps
  const localeTag = locale?.locale
  const weekStartDay = locale?.weekStartDay ?? 0
  const localeDirection = locale?.direction

  // -------------------------------------------------------------------------
  // Grid  -  rebuild when month, value, or constraints change
  // -------------------------------------------------------------------------
  const months: ICalendarMonth<TDate>[] = useMemo(() => {
    const resolvedLocale =
      localeTag || localeDirection || weekStartDay
        ? { locale: localeTag, weekStartDay, direction: localeDirection }
        : undefined
    const gridConfig = { showOutsideDays, fixedWeeks, locale: resolvedLocale }
    const rawMonths =
      numberOfMonths <= 1
        ? [buildCalendarMonth(adapter, month, gridConfig)]
        : buildMultiMonth(adapter, month, numberOfMonths, gridConfig)

    return rawMonths.map((m) => ({
      ...m,
      weeks: applySelection(m.weeks, adapter, mode, value, constraints),
    }))
  }, [
    adapter,
    month,
    mode,
    value,
    constraints,
    showOutsideDays,
    fixedWeeks,
    localeTag,
    weekStartDay,
    localeDirection,
    numberOfMonths,
  ])

  // First month's weeks for backward compat
  const weeks = months[0]?.weeks ?? []

  // -------------------------------------------------------------------------
  // Weekday headers
  // -------------------------------------------------------------------------
  const weekdays = useMemo(
    () => getLocalizedWeekdays(adapter, localeTag, weekStartDay, 'short'),
    [adapter, localeTag, weekStartDay],
  )

  // -------------------------------------------------------------------------
  // Navigation helpers
  // -------------------------------------------------------------------------
  const canGoNext = useMemo(
    () => canNavigate(adapter, month, 'next', 'month', { fromDate, toDate }),
    [adapter, month, fromDate, toDate],
  )
  const canGoPrevious = useMemo(
    () => canNavigate(adapter, month, 'prev', 'month', { fromDate, toDate }),
    [adapter, month, fromDate, toDate],
  )

  const goToNext = useCallback(() => {
    if (!canGoNext) return
    setMonthState(navigate(adapter, month, 'next', 'month'))
  }, [adapter, month, canGoNext, setMonthState])

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return
    setMonthState(navigate(adapter, month, 'prev', 'month'))
  }, [adapter, month, canGoPrevious, setMonthState])

  const setMonth = useCallback((next: TDate) => setMonthState(next), [setMonthState])

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------
  const selectDate = useCallback(
    (date: TDate, options?: { shiftKey?: boolean }) => {
      if (isDisabledFn(date)) {
        announce(buildDateDisabledMessage(adapter.format(date, { month: 'long', day: 'numeric' }, localeTag)))
        return
      }
      const next = selectDay(adapter, mode, value, date, options)
      setValue(next)
    },
    [adapter, mode, value, setValue, isDisabledFn, localeTag, announce],
  )

  // -------------------------------------------------------------------------
  // Announce on month change
  // -------------------------------------------------------------------------
  const prevMonthRef = useRef<TDate | null>(null)
  useEffect(() => {
    if (prevMonthRef.current !== null && !adapter.isSameMonth(prevMonthRef.current, month)) {
      announce(
        buildMonthNavigationMessage(
          adapter.format(month, { month: 'long' }, localeTag),
          adapter.format(month, { year: 'numeric' }, localeTag),
        ),
      )
    }
    prevMonthRef.current = month
  }, [month, adapter, announce, localeTag])

  // Announce on value change
  const prevValueRef = useRef<CalendarValue<TDate, M> | null>(null)
  useEffect(() => {
    if (prevValueRef.current === value) return
    prevValueRef.current = value

    if (value === null) return

    const fmt = (d: TDate) => adapter.format(d, { month: 'long', day: 'numeric' }, localeTag)

    if (mode === 'single' && value !== null) {
      announce(buildDateSelectedMessage(fmt(value as TDate)))
    } else if (mode === 'range') {
      const range = value as DateRange<TDate> | null
      if (range?.to) {
        announce(buildRangeSelectedMessage(fmt(range.from), fmt(range.to)))
      }
    }
  }, [value, mode, adapter, announce, localeTag])

  // -------------------------------------------------------------------------
  // Focus management  -  auto-advance month when focus leaves the visible month
  // -------------------------------------------------------------------------
  // RAF id for focus management - cancelled on unmount to prevent memory leaks
  const rafRef = useRef<number>(0)
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleFocusChange = useCallback(
    (date: TDate) => {
      setFocusedDate(date)
      if (!adapter.isSameMonth(date, month)) {
        setMonthState(adapter.startOfMonth(date))
      }
      // Move DOM focus after React re-render (keyboard nav only)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const el = document.querySelector<HTMLElement>('[data-calendar-day][data-focused="true"]')
        if (el && document.activeElement !== el) {
          el.focus({ preventScroll: true })
        }
      })
    },
    [adapter, month, setMonthState],
  )

  // -------------------------------------------------------------------------
  // Keyboard
  // -------------------------------------------------------------------------
  const keyboard = useKeyboard({
    focusedDate,
    onFocusChange: handleFocusChange,
    onSelect: selectDate,
    onDismiss: config.onDismiss,
    isDisabled: isDisabledFn,
    adapter,
    weekStartDay: locale?.weekStartDay ?? 0,
  })

  // -------------------------------------------------------------------------
  // Prop getters
  // -------------------------------------------------------------------------
  const getDayProps = useCallback(
    (day: ICalendarDay<TDate>) =>
      buildDayProps(day, focusedDate, adapter, selectDate, setFocusedDate, keyboard.onKeyDown, localeTag),
    [focusedDate, adapter, selectDate, keyboard.onKeyDown, localeTag],
  )

  const getGridProps = useCallback(() => buildGridProps(headerId), [headerId])

  const getNavProps = useCallback(
    (direction: 'prev' | 'next') => buildNavProps(direction, canGoPrevious, canGoNext, goToPrevious, goToNext),
    [canGoPrevious, canGoNext, goToPrevious, goToNext],
  )

  const getHeaderProps = useCallback(() => buildHeaderProps(headerId), [headerId])

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------
  return {
    state: { month, value, focusedDate, viewMode, weeks, months, weekdays, canGoNext, canGoPrevious },
    actions: {
      setMonth,
      setViewMode,
      goToNext,
      goToPrevious,
      selectDate,
      focusDate: setFocusedDate,
    },
    getDayProps,
    getGridProps,
    getNavProps,
    getHeaderProps,
    announcer,
  }
}
