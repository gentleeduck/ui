import type { CalendarValue, SelectionMode } from '@gentleduck/calendar'
import type { Direction } from '@gentleduck/primitives/direction'
import type { Button } from '../button'

export interface CalendarProps {
  className?: string
  /** Variant style for navigation buttons. Default `'ghost'`. */
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  /** Selection mode. Default `'single'`. */
  mode?: SelectionMode
  /** Controlled selection value. */
  selected?: CalendarValue<Date, SelectionMode>
  /** Called when the selection changes. */
  onSelect?: (value: CalendarValue<Date, SelectionMode>) => void
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
}
