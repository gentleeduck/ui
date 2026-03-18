import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  buildCalendarMonth,
  buildMultiMonth,
  type CalendarDay,
  type CalendarMonth,
  getLocalizedWeekdays,
} from '../../grid'
import type { ViewMode } from '../../index.types'
import { canNavigate, navigate } from '../../navigation'
import type { CalendarValue, DateRange, SelectionConstraints, SelectionMode } from '../../selection'
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
import type { UseCalendarConfig, UseCalendarReturn } from './use-calendar.types'

// ---------------------------------------------------------------------------
// useCalendar
// ---------------------------------------------------------------------------

export function useCalendar<TDate, M extends SelectionMode = 'single'>(
  config: UseCalendarConfig<TDate, M>,
): UseCalendarReturn<TDate, M> {
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
    (mode === 'multi' ? ([] as unknown as CalendarValue<TDate, M>) : (null as CalendarValue<TDate, M>))

  const [value, setValue] = useControllableState<CalendarValue<TDate, M>>(controlledSelected, initialValue, onSelect)

  // -------------------------------------------------------------------------
  // Local state
  // -------------------------------------------------------------------------
  const [focusedDate, setFocusedDate] = useState<TDate>(() => adapter.today())
  const [viewMode, setViewMode] = useState<ViewMode>('days')

  // -------------------------------------------------------------------------
  // Constraints (memoised to keep a stable reference)
  // -------------------------------------------------------------------------
  const constraints: SelectionConstraints<TDate> = useMemo(
    () => ({ disabled, fromDate, toDate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fromDate, toDate, disabled],
  )

  const isDisabledFn = useCallback((date: TDate) => isDateDisabled(adapter, date, constraints), [adapter, constraints])

  // -------------------------------------------------------------------------
  // Grid — rebuild when month, value, or constraints change
  // -------------------------------------------------------------------------
  const months: CalendarMonth<TDate>[] = useMemo(() => {
    const gridConfig = { showOutsideDays, fixedWeeks, locale }
    const rawMonths =
      numberOfMonths <= 1
        ? [buildCalendarMonth(adapter, month, gridConfig)]
        : buildMultiMonth(adapter, month, numberOfMonths, gridConfig)

    return rawMonths.map((m) => ({
      ...m,
      weeks: applySelection(m.weeks, adapter, mode, value, constraints),
    }))
  }, [adapter, month, mode, value, constraints, showOutsideDays, fixedWeeks, locale, numberOfMonths])

  // First month's weeks for backward compat
  const weeks = months[0]?.weeks ?? []

  // -------------------------------------------------------------------------
  // Weekday headers
  // -------------------------------------------------------------------------
  const weekdays = useMemo(
    () => getLocalizedWeekdays(adapter, locale?.locale, locale?.weekStartDay ?? 0, 'short'),
    [adapter, locale],
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
    (date: TDate) => {
      if (isDisabledFn(date)) {
        announce(buildDateDisabledMessage(adapter.format(date, { month: 'long', day: 'numeric' }, locale?.locale)))
        return
      }
      const next = selectDay(adapter, mode, value, date)
      setValue(next)
    },
    [adapter, mode, value, setValue, isDisabledFn, locale, announce],
  )

  // -------------------------------------------------------------------------
  // Announce on month change
  // -------------------------------------------------------------------------
  const prevMonthRef = useRef<TDate | null>(null)
  useEffect(() => {
    if (prevMonthRef.current !== null && !adapter.isSameMonth(prevMonthRef.current, month)) {
      announce(
        buildMonthNavigationMessage(
          adapter.format(month, { month: 'long' }, locale?.locale),
          adapter.format(month, { year: 'numeric' }, locale?.locale),
        ),
      )
    }
    prevMonthRef.current = month
  }, [month, adapter, announce, locale])

  // Announce on value change
  const prevValueRef = useRef<CalendarValue<TDate, M> | null>(null)
  useEffect(() => {
    if (prevValueRef.current === value) return
    prevValueRef.current = value

    if (value === null) return

    const fmt = (d: TDate) => adapter.format(d, { month: 'long', day: 'numeric' }, locale?.locale)

    if (mode === 'single' && value !== null) {
      announce(buildDateSelectedMessage(fmt(value as TDate)))
    } else if (mode === 'range') {
      const range = value as DateRange<TDate> | null
      if (range?.to) {
        announce(buildRangeSelectedMessage(fmt(range.from), fmt(range.to)))
      }
    }
  }, [value, mode, adapter, announce, locale])

  // -------------------------------------------------------------------------
  // Focus management — auto-advance month when focus leaves the visible month
  // -------------------------------------------------------------------------
  const handleFocusChange = useCallback(
    (date: TDate) => {
      setFocusedDate(date)
      if (!adapter.isSameMonth(date, month)) {
        setMonthState(adapter.startOfMonth(date))
      }
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
    (day: CalendarDay<TDate>) =>
      buildDayProps(day, focusedDate, adapter, selectDate, setFocusedDate, keyboard.onKeyDown, locale?.locale),
    [focusedDate, adapter, selectDate, keyboard.onKeyDown, locale],
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
