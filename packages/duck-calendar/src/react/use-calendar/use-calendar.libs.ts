import type React from 'react'
import type { DateAdapter } from '../../adapter'
import type { CalendarDay } from '../../grid'
import type { DayProps, GridProps, HeaderProps, NavProps } from './use-calendar.types'

export function buildDayProps<TDate>(
  day: CalendarDay<TDate>,
  focusedDate: TDate,
  adapter: DateAdapter<TDate>,
  selectDate: (date: TDate) => void,
  focusDate: (date: TDate) => void,
  onKeyDown: React.KeyboardEventHandler,
): DayProps {
  const isFocused = adapter.isSameDay(day.date, focusedDate)

  return {
    role: 'gridcell',
    'aria-selected': day.isSelected,
    'aria-disabled': day.isDisabled,
    'aria-current': day.isToday ? 'date' : undefined,
    tabIndex: isFocused ? 0 : -1,
    'data-calendar-day': '',
    'data-selected': day.isSelected ? 'true' : undefined,
    'data-today': day.isToday ? 'true' : undefined,
    'data-disabled': day.isDisabled ? '' : undefined,
    'data-outside-month': day.isOutside ? 'true' : undefined,
    'data-in-range': day.isRangeMiddle ? 'true' : undefined,
    'data-range-start': day.isRangeStart ? 'true' : undefined,
    'data-range-end': day.isRangeEnd ? 'true' : undefined,
    'data-focused': isFocused ? 'true' : undefined,
    'data-weekend': day.isWeekend ? 'true' : undefined,
    onClick: () => selectDate(day.date),
    onMouseEnter: () => focusDate(day.date),
    onKeyDown,
  }
}

export function buildGridProps(headerId: string): GridProps {
  return {
    role: 'grid',
    'aria-labelledby': headerId,
  }
}

export function buildNavProps(
  direction: 'prev' | 'next',
  canGoPrevious: boolean,
  canGoNext: boolean,
  goToPrevious: () => void,
  goToNext: () => void,
): NavProps {
  return {
    'aria-label': direction === 'prev' ? 'Go to previous month' : 'Go to next month',
    disabled: direction === 'prev' ? !canGoPrevious : !canGoNext,
    onClick: direction === 'prev' ? goToPrevious : goToNext,
  }
}

export function buildHeaderProps(headerId: string): HeaderProps {
  return {
    id: headerId,
    'aria-live': 'polite',
  }
}
