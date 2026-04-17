import type { Grid } from '../../grid'
import type { ICalendarConfig, ViewMode } from '../../index.types'
import type { Selection } from '../../selection'
import type { IAnnouncerReturn } from '../use-announcer'

export interface IUseCalendarConfig<TDate, M extends Selection.SelectionMode = 'single'>
  extends ICalendarConfig<TDate, M> {
  /** Initial selected value for uncontrolled usage. */
  defaultSelected?: Selection.CalendarValue<TDate, M>
}

export interface IDayProps {
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
  'data-hidden': 'true' | undefined
  'data-range-middle': 'true' | undefined
  'data-range-start': 'true' | undefined
  'data-range-end': 'true' | undefined
  'data-focused': 'true' | undefined
  'data-weekend': 'true' | undefined
  onClick: (e?: { shiftKey?: boolean }) => void
  onMouseEnter: () => void
  onKeyDown: React.KeyboardEventHandler
}

export interface IGridProps {
  role: 'grid'
  'aria-labelledby': string
  'aria-roledescription': string
}

export interface INavProps {
  'aria-label': string
  disabled: boolean
  onClick: () => void
}

export interface IHeaderProps {
  id: string
  'aria-live': 'polite'
}

export interface IUseCalendarReturn<TDate, M extends Selection.SelectionMode> {
  state: {
    /** The currently visible month. */
    month: TDate
    /** The current selection value. Shape depends on mode. */
    value: Selection.CalendarValue<TDate, M>
    /** The date that currently has keyboard focus. */
    focusedDate: TDate
    /** Whether we're showing the day grid, month picker, or year picker. */
    viewMode: ViewMode
    /** Decorated weeks for the first (or only) month. */
    weeks: Grid.ICalendarWeek<TDate>[]
    /** All month grids when numberOfMonths > 1. */
    months: Grid.ICalendarMonth<TDate>[]
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
    selectDate: (date: TDate, options?: { shiftKey?: boolean }) => void
    focusDate: (date: TDate) => void
  }
  /** Spread onto each day cell element. */
  getDayProps: (day: Grid.ICalendarDay<TDate>) => IDayProps
  /** Spread onto the grid container element. */
  getGridProps: () => IGridProps
  /** Spread onto prev/next navigation buttons. */
  getNavProps: (direction: 'prev' | 'next') => INavProps
  /** Spread onto the month/year header element. */
  getHeaderProps: () => IHeaderProps
  /** Render announcer inside the calendar tree for screen reader announcements. */
  announcer: IAnnouncerReturn
}
