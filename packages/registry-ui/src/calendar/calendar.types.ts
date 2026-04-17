import type { Adapter, Grid, Selection, UseCalendar } from '@gentleduck/calendar'
import type { Direction } from '@gentleduck/primitives/direction'
import type { Button } from '../button'

export interface ICalendarHeaderContext {
  /** The current displayed month Date. */
  month: Date
  /** Formatted title string (e.g. "March 2026"). */
  title: string
  /** Resolved text direction. */
  direction: 'ltr' | 'rtl'
  /** Navigate to the previous month. */
  goToPrevMonth: () => void
  /** Navigate to the next month. */
  goToNextMonth: () => void
  /** Whether previous navigation is disabled. */
  isPrevDisabled: boolean
  /** Whether next navigation is disabled. */
  isNextDisabled: boolean
}

export interface ICalendarHeaderProps {
  adapter?: Adapter.IDateAdapter<Date>
  month: Date
  title: string
  direction: 'ltr' | 'rtl'
  locale?: string
  buttonVariant: string
  showDropdowns: boolean
  yearRange: { from: number; to: number }
  getNavProps: (dir: 'prev' | 'next') => { 'aria-label': string; disabled: boolean; onClick: () => void }
  getHeaderProps: () => { id: string; 'aria-live': 'polite' }
  onMonthSelect: (date: Date) => void
}

export interface ICalendarDayCellProps {
  day: Grid.ICalendarDay<Date>
  dayProps: Omit<UseCalendar.IDayProps, 'role' | 'aria-selected' | 'onMouseEnter'>
  isFocused: boolean
  isSelectedSingle: boolean
  isFirstInRow: boolean
  isLastInRow: boolean
  locale?: string
  onFocusDate: (date: Date) => void
  renderDay?: (day: Grid.ICalendarDay<Date>, children: React.ReactNode) => React.ReactNode
}

export type ICalendarSelectionValue<
  TMode extends Selection.SelectionMode = Selection.SelectionMode,
> = Selection.CalendarValue<Date, TMode>

export type ICalendarProps =
  | ICalendarProps.ISingle
  | ICalendarProps.IRange
  | ICalendarProps.IMulti
  | ICalendarProps.IMultiRange

export namespace ICalendarProps {
  export interface IBase {
    className?: string
    /**
     * Date adapter for alternative calendar systems (Islamic, Persian, etc.).
     * Default uses `NativeAdapter` (Gregorian).
     */
    adapter?: Adapter.IDateAdapter<Date>
    /** Variant style for navigation buttons. Default `'ghost'`. */
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
    /** Dates that cannot be selected. */
    disabled?: Date[] | ((date: Date) => boolean)
    /** Default month to display (uncontrolled). */
    defaultMonth?: Date
    /** Controlled month. */
    month?: Date
    /** Called when the displayed month changes. */
    onMonthChange?: (month: Date) => void
    /** Show days from adjacent months. Default `true`. */
    showOutsideDays?: boolean
    /** Always show 6 weeks. Default `false`. */
    fixedWeeks?: boolean
    /** How many months to show side by side. Default `1`. */
    numberOfMonths?: number
    /** BCP 47 locale tag (e.g. `'ar-SA'`). */
    locale?: string
    /** Text direction. */
    dir?: Direction
    /** Earliest selectable date. */
    fromDate?: Date
    /** Latest selectable date. */
    toDate?: Date
    /** Called when the user presses Escape. */
    onDismiss?: () => void
    /**
     * Show month and year dropdowns in the header.
     * Default `true`. Set to `false` for a minimal caption.
     */
    showDropdowns?: boolean
    /**
     * Range of years to show in the year dropdown.
     * Default `{ from: currentYear - 100, to: currentYear + 10 }`.
     */
    yearRange?: { from: number; to: number }
    /**
     * Custom render function for day cells.
     * Receives the day object and the default rendered children (the date number).
     * Return a ReactNode to replace or wrap the default content.
     *
     * @example
     * ```tsx
     * renderDay={(day, children) => (
     *   <>
     *     {children}
     *     {hasEvents(day.date) && <span className="size-1 rounded-full bg-primary" />}
     *   </>
     * )}
     * ```
     */
    renderDay?: (day: Grid.ICalendarDay<Date>, children: React.ReactNode) => React.ReactNode
    /**
     * Custom render function for the navigation header.
     * Receives header context with month info and navigation controls.
     * Return a ReactNode to replace the default header entirely.
     *
     * @example
     * ```tsx
     * renderHeader={({ title, goToPrevMonth, goToNextMonth }) => (
     *   <div className="flex items-center justify-between">
     *     <button onClick={goToPrevMonth}><-</button>
     *     <span>{title}</span>
     *     <button onClick={goToNextMonth}>-></button>
     *   </div>
     * )}
     * ```
     */
    renderHeader?: (context: ICalendarHeaderContext) => React.ReactNode
    /**
     * Custom render function for weekday column headers.
     * Receives the weekday abbreviation (e.g. "Sun") and its index (0-6).
     * Return a ReactNode to replace the default weekday label.
     *
     * @example
     * ```tsx
     * renderWeekday={(day, index) => (
     *   <span className={index === 0 || index === 6 ? 'text-red-500' : ''}>
     *     {day}
     *   </span>
     * )}
     * ```
     */
    renderWeekday?: (day: string, index: number) => React.ReactNode
    /**
     * Render content below the calendar grid.
     * Receives the current months array for context.
     *
     * @example
     * ```tsx
     * renderFooter={(months) => (
     *   <div className="mt-2 text-xs text-muted-foreground">
     *     Selected: {selected?.toLocaleDateString()}
     *   </div>
     * )}
     * ```
     */
    renderFooter?: (months: Grid.ICalendarMonth<Date>[]) => React.ReactNode
  }

  export interface ISingle extends IBase {
    /** Selection mode. Default `'single'`. */
    mode?: 'single'
    /** Controlled selection value. */
    selected?: ICalendarSelectionValue<'single'>
    /** Called when the selection changes. */
    onSelect?: (value: ICalendarSelectionValue<'single'>) => void
  }

  export interface IRange extends IBase {
    /** Selection mode. */
    mode: 'range'
    /** Controlled selection value. */
    selected?: ICalendarSelectionValue<'range'>
    /** Called when the selection changes. */
    onSelect?: (value: ICalendarSelectionValue<'range'>) => void
  }

  export interface IMulti extends IBase {
    /** Selection mode. */
    mode: 'multi'
    /** Controlled selection value. */
    selected?: ICalendarSelectionValue<'multi'>
    /** Called when the selection changes. */
    onSelect?: (value: ICalendarSelectionValue<'multi'>) => void
  }

  export interface IMultiRange extends IBase {
    /** Selection mode. */
    mode: 'multi-range'
    /** Controlled selection value. */
    selected?: ICalendarSelectionValue<'multi-range'>
    /** Called when the selection changes. */
    onSelect?: (value: ICalendarSelectionValue<'multi-range'>) => void
  }
}
