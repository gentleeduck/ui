import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Grid } from '../../grid'
import { buildCalendarMonth, buildMultiMonth, getLocalizedWeekdays } from '../../grid'
import type { Calendar } from '../../index.types'
import { canNavigate, navigate } from '../../navigation'
import type { Selection } from '../../selection'
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
import {
  buildDayProps,
  buildGridProps,
  buildHeaderProps,
  buildNavProps,
  emptySelectionValue,
  initialFocusFromSelected,
} from './use-calendar.libs'
import type { UseCalendar } from './use-calendar.types'

export function useCalendar<TDate, M extends Selection.SelectionMode = 'single'>(
  config: UseCalendar.IUseCalendarConfig<TDate, M>,
): UseCalendar.IUseCalendarReturn<TDate, M> {
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
  const gridId = useId()

  // Declared early so `announce` is available to selectDate below.
  const announcer = useAnnouncer()
  const { announce } = announcer

  const initialMonth = defaultMonth ?? controlledMonth ?? adapter.today()

  const [month, setMonthState] = useControllableState<TDate>(controlledMonth, initialMonth, onMonthChange)

  const initialValue: Selection.CalendarValue<TDate, M> = defaultSelected ?? emptySelectionValue<TDate, M>(mode)

  const [value, setValue] = useControllableState<Selection.CalendarValue<TDate, M>>(
    controlledSelected,
    initialValue,
    onSelect,
  )

  const [focusedDate, setFocusedDate] = useState<TDate>(
    () => initialFocusFromSelected(mode, controlledSelected ?? defaultSelected) ?? adapter.today(),
  )
  const [viewMode, setViewMode] = useState<Calendar.ViewMode>('days')

  // Callers MUST stabilize `disabled` — inline predicate/literal forces months memo recompute.
  const constraints: Selection.ISelectionConstraints<TDate> = useMemo(
    () => ({ disabled, fromDate, toDate }),
    [fromDate, toDate, disabled],
  )

  const isDisabledFn = useCallback((date: TDate) => isDateDisabled(adapter, date, constraints), [adapter, constraints])

  // Primitives extracted so memo deps stay stable.
  const localeTag = locale?.locale
  // Raw preserves "not provided" vs explicit `0` so weekStartDay: 0 (Sunday) is still forwarded.
  const rawWeekStartDay = locale?.weekStartDay
  const weekStartDay = rawWeekStartDay ?? 0
  const localeDirection = locale?.direction

  const months: Grid.ICalendarMonth<TDate>[] = useMemo(() => {
    const resolvedLocale =
      localeTag !== undefined || localeDirection !== undefined || rawWeekStartDay !== undefined
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
    rawWeekStartDay,
    localeDirection,
    numberOfMonths,
  ])

  // First month's weeks for backward compat
  const weeks = months[0]?.weeks ?? []

  const weekdays = useMemo(
    () => getLocalizedWeekdays(adapter, localeTag, weekStartDay, 'short'),
    [adapter, localeTag, weekStartDay],
  )

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

  // Announce on month change.
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
  const prevValueRef = useRef<Selection.CalendarValue<TDate, M> | null>(null)
  useEffect(() => {
    if (prevValueRef.current === value) return
    prevValueRef.current = value

    if (value === null) return

    const fmt = (d: TDate) => adapter.format(d, { month: 'long', day: 'numeric' }, localeTag)

    if (mode === 'single' && value !== null) {
      announce(buildDateSelectedMessage(fmt(value as TDate)))
    } else if (mode === 'range') {
      const range = value as Selection.DateRange<TDate> | null
      if (range?.to) {
        announce(buildRangeSelectedMessage(fmt(range.from), fmt(range.to)))
      }
    }
  }, [value, mode, adapter, announce, localeTag])

  // Focus management: auto-advance month when focus leaves the visible month.
  // RAF id is cancelled on unmount to avoid leaks.
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
      // Move DOM focus after React re-render (keyboard nav only). Scope the query
      // by `data-calendar-grid="<gridId>"` so multi-calendar pages don't grab the
      // focused cell from a sibling calendar.
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        // Use attribute selector with CSS.escape-equivalent for safety on
        // useId-generated values that contain `:` (which is invalid in CSS ids).
        const root = document.querySelector<HTMLElement>(`[data-calendar-grid="${gridId}"]`)
        const el = (root ?? document).querySelector<HTMLElement>('[data-calendar-day][data-focused="true"]')
        if (el && document.activeElement !== el) {
          el.focus({ preventScroll: true })
        }
      })
    },
    [adapter, month, setMonthState, gridId],
  )

  const keyboard = useKeyboard({
    focusedDate,
    onFocusChange: handleFocusChange,
    onSelect: selectDate,
    onDismiss: config.onDismiss,
    isDisabled: isDisabledFn,
    adapter,
    weekStartDay: locale?.weekStartDay ?? 0,
  })

  const getDayProps = useCallback(
    (day: Grid.ICalendarDay<TDate>) =>
      buildDayProps(day, focusedDate, adapter, selectDate, setFocusedDate, keyboard.onKeyDown, localeTag),
    [focusedDate, adapter, selectDate, keyboard.onKeyDown, localeTag],
  )

  const getGridProps = useCallback(() => buildGridProps(headerId, gridId), [headerId, gridId])

  const getNavProps = useCallback(
    (direction: 'prev' | 'next') => buildNavProps(direction, canGoPrevious, canGoNext, goToPrevious, goToNext),
    [canGoPrevious, canGoNext, goToPrevious, goToNext],
  )

  const getHeaderProps = useCallback(() => buildHeaderProps(headerId), [headerId])

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
