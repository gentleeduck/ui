import type React from 'react'
import type { Adapter } from '../../adapter'
import type { Grid } from '../../grid'
import type { Selection } from '../../selection'
import type { UseCalendar } from './use-calendar.types'

/**
 * Empty initial value for `useControllableState` per selection mode.
 * - `multi` / `multi-range` start as `[]`
 * - `single` / `range` start as `null`
 *
 * Hides the mode-discriminated cast in one place so callers stay clean.
 */
export function emptySelectionValue<TDate, M extends Selection.SelectionMode>(
  mode: M,
): Selection.CalendarValue<TDate, M> {
  if (mode === 'multi' || mode === 'multi-range') {
    return [] as Selection.CalendarValue<TDate, M>
  }
  return null as Selection.CalendarValue<TDate, M>
}

/**
 * Pick the initial focused date from a selection value, narrowing the
 * mode-discriminated `CalendarValue` to a concrete `TDate`.
 * Returns `null` if no date can be derived (multi/multi-range/empty).
 */
export function initialFocusFromSelected<TDate, M extends Selection.SelectionMode>(
  mode: M,
  selected: Selection.CalendarValue<TDate, M> | undefined,
): TDate | null {
  if (selected == null) return null
  if (mode === 'single') {
    return selected as unknown as TDate
  }
  if (mode === 'range') {
    const range = selected as unknown as Selection.DateRange<TDate>
    return range.from ?? null
  }
  // multi / multi-range: don't auto-focus the first selected item to avoid
  // jumping the user's view unexpectedly.
  return null
}

export function buildDayProps<TDate>(
  day: Grid.ICalendarDay<TDate>,
  focusedDate: TDate,
  adapter: Adapter.IDateAdapter<TDate>,
  selectDate: (date: TDate, options?: { shiftKey?: boolean }) => void,
  focusDate: (date: TDate) => void,
  onKeyDown: React.KeyboardEventHandler,
  locale?: string,
): UseCalendar.IDayProps {
  const isFocused = adapter.isSameDay(day.date, focusedDate)

  return {
    role: 'gridcell',
    'aria-label': adapter.format(day.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, locale),
    'aria-selected': day.isSelected,
    'aria-disabled': day.isDisabled,
    'aria-current': day.isToday ? 'date' : undefined,
    tabIndex: isFocused ? 0 : -1,
    'data-calendar-day': '',
    'data-selected': day.isSelected ? 'true' : undefined,
    'data-today': day.isToday ? 'true' : undefined,
    'data-disabled': day.isDisabled ? 'true' : undefined,
    'data-outside-month': day.isOutside ? 'true' : undefined,
    'data-hidden': day.isHidden ? 'true' : undefined,
    'data-range-middle': day.isRangeMiddle ? 'true' : undefined,
    'data-range-start': day.isRangeStart ? 'true' : undefined,
    'data-range-end': day.isRangeEnd ? 'true' : undefined,
    'data-focused': isFocused ? 'true' : undefined,
    'data-weekend': day.isWeekend ? 'true' : undefined,
    onClick: (e?: { shiftKey?: boolean }) => selectDate(day.date, e?.shiftKey ? { shiftKey: true } : undefined),
    onMouseEnter: () => focusDate(day.date),
    onKeyDown,
  }
}

export function buildGridProps(headerId: string, gridId: string): UseCalendar.IGridProps {
  return {
    role: 'grid',
    'aria-labelledby': headerId,
    'aria-roledescription': 'calendar',
    'data-calendar-grid': gridId,
  }
}

export function buildNavProps(
  direction: 'prev' | 'next',
  canGoPrevious: boolean,
  canGoNext: boolean,
  goToPrevious: () => void,
  goToNext: () => void,
  prevLabel?: string,
  nextLabel?: string,
): UseCalendar.INavProps {
  return {
    'aria-label': direction === 'prev' ? (prevLabel ?? 'Go to previous month') : (nextLabel ?? 'Go to next month'),
    disabled: direction === 'prev' ? !canGoPrevious : !canGoNext,
    onClick: direction === 'prev' ? goToPrevious : goToNext,
  }
}

export function buildHeaderProps(headerId: string): UseCalendar.IHeaderProps {
  return {
    id: headerId,
    'aria-live': 'polite',
  }
}
