import type { CalendarDay, CalendarMonth, CalendarWeek } from '../../grid'
import type { CalendarConfig, ViewMode } from '../../index.types'
import type { CalendarValue, SelectionMode } from '../../selection'
import type { AnnouncerReturn } from '../use-announcer'

export interface UseCalendarConfig<TDate, M extends SelectionMode = 'single'> extends CalendarConfig<TDate, M> {
  /** Initial selected value for uncontrolled usage. */
  defaultSelected?: CalendarValue<TDate, M>
}

export interface DayProps {
  role: 'gridcell'
  'aria-label': string
  'aria-selected': boolean
  'aria-disabled': boolean
  'aria-current': 'date' | undefined
  tabIndex: 0 | -1
  'data-calendar-day': ''
  'data-selected': 'true' | undefined
  'data-today': 'true' | undefined
  'data-disabled': 'true' | undefined
  'data-outside-month': 'true' | undefined
  'data-in-range': 'true' | undefined
  'data-range-start': 'true' | undefined
  'data-range-end': 'true' | undefined
  'data-focused': 'true' | undefined
  'data-weekend': 'true' | undefined
  onClick: () => void
  onMouseEnter: () => void
  onKeyDown: React.KeyboardEventHandler
}

export interface GridProps {
  role: 'grid'
  'aria-labelledby': string
  'aria-roledescription': string
}

export interface NavProps {
  'aria-label': string
  disabled: boolean
  onClick: () => void
}

export interface HeaderProps {
  id: string
  'aria-live': 'polite'
}

export interface UseCalendarReturn<TDate, M extends SelectionMode> {
  state: {
    /** The currently visible month. */
    month: TDate
    /** The current selection value. Shape depends on mode. */
    value: CalendarValue<TDate, M>
    /** The date that currently has keyboard focus. */
    focusedDate: TDate
    /** Whether we're showing the day grid, month picker, or year picker. */
    viewMode: ViewMode
    /** Decorated weeks for the first (or only) month. */
    weeks: CalendarWeek<TDate>[]
    /** All month grids when numberOfMonths > 1. */
    months: CalendarMonth<TDate>[]
    /** Localised weekday header labels (7 items). */
    weekdays: string[]
    /** Whether forward navigation is possible (respects toDate). */
    canGoNext: boolean
    /** Whether backward navigation is possible (respects fromDate). */
    canGoPrevious: boolean
  }
  actions: {
    setMonth: (month: TDate) => void
    setViewMode: (mode: ViewMode) => void
    goToNext: () => void
    goToPrevious: () => void
    selectDate: (date: TDate) => void
    focusDate: (date: TDate) => void
  }
  /** Spread onto each day cell element. */
  getDayProps: (day: CalendarDay<TDate>) => DayProps
  /** Spread onto the grid container element. */
  getGridProps: () => GridProps
  /** Spread onto prev/next navigation buttons. */
  getNavProps: (direction: 'prev' | 'next') => NavProps
  /** Spread onto the month/year header element. */
  getHeaderProps: () => HeaderProps
  /** Render announcer inside the calendar tree for screen reader announcements. */
  announcer: AnnouncerReturn
}
