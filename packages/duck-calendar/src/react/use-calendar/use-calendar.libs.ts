import type React from 'react'
import type { Adapter } from '../../adapter'
import type { Grid } from '../../grid'
import type { UseCalendar } from './use-calendar.types'

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

export function buildGridProps(headerId: string): UseCalendar.IGridProps {
  return {
    role: 'grid',
    'aria-labelledby': headerId,
    'aria-roledescription': 'calendar',
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
