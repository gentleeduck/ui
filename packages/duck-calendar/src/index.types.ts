import type { Adapter } from './adapter'
import type { Selection } from './selection'

/** Which view the calendar is showing. */
export type ViewMode = 'days' | 'months' | 'years'

/** Locale and direction settings for the calendar. */
export interface ICalendarLocaleConfig {
  /** BCP 47 language tag, e.g. `'en-US'`, `'ar-SA'`, `'fa-IR'`. */
  locale?: string
  /** Which day starts the week. 0 = Sunday (default), 1 = Monday, etc. */
  weekStartDay?: Adapter.WeekStartDay
  /** Text direction. */
  direction?: 'ltr' | 'rtl'
}

/**
 * Full configuration for a calendar instance.
 * Generic over `TDate` (from the adapter) and `M` (selection mode).
 */
export interface ICalendarConfig<TDate, M extends Selection.SelectionMode = 'single'> {
  /** The date adapter to use (e.g. `new NativeAdapter()`). */
  adapter: Adapter.IDateAdapter<TDate>
  /** Selection mode: `'single'`, `'range'`, or `'multi'`. */
  mode: M
  /** Locale and direction settings. */
  locale?: ICalendarLocaleConfig

  /** Controlled month  -  the month currently displayed. */
  month?: TDate
  /** Default month for uncontrolled usage. */
  defaultMonth?: TDate
  /** Controlled selection value. Shape depends on `mode`. */
  selected?: Selection.CalendarValue<TDate, M>
  /** Called when the selection changes. */
  onSelect?: (value: Selection.CalendarValue<TDate, M>) => void
  /** Called when the displayed month changes. */
  onMonthChange?: (month: TDate) => void

  /** How many months to show side by side. Default `1`. */
  numberOfMonths?: number
  /** Show days from previous/next month to fill the grid. Default `true`. */
  showOutsideDays?: boolean
  /** Always show 6 weeks so the grid height doesn't jump. Default `false`. */
  fixedWeeks?: boolean

  /** Dates that cannot be selected. Array or predicate function. */
  disabled?: TDate[] | ((date: TDate) => boolean)
  /** Earliest selectable date. */
  fromDate?: TDate
  /** Latest selectable date. */
  toDate?: TDate

  /** Called when the user presses Escape (e.g. to close a date picker popover). */
  onDismiss?: () => void
}
