/** A single day cell in the calendar grid. */
export interface CalendarDay<TDate> {
  /** The date this cell represents. */
  date: TDate
  /** Whether this date is today. */
  isToday: boolean
  /** Whether this date is selected. Filled by `applySelection()`. */
  isSelected: boolean
  /** Whether this date is disabled (constraints). Filled by `applySelection()`. */
  isDisabled: boolean
  /** Whether this date belongs to the previous or next month. */
  isOutside: boolean
  /** Whether this date is Saturday or Sunday. */
  isWeekend: boolean
  /** Whether this date is the start of a selected range. Filled by `applySelection()`. */
  isRangeStart: boolean
  /** Whether this date is the end of a selected range. */
  isRangeEnd: boolean
  /** Whether this date is between the start and end of a selected range. */
  isRangeMiddle: boolean
}

/** A single row (week) in the calendar grid. */
export interface CalendarWeek<TDate> {
  /** ISO week number. */
  weekNumber: number
  /** The 7 days in this week. Always exactly 7 items. */
  days: CalendarDay<TDate>[]
}

/** A full month grid ready to render. */
export interface CalendarMonth<TDate> {
  /** The first day of this month. */
  month: TDate
  /** The weeks in this month (5 or 6 depending on `fixedWeeks`). */
  weeks: CalendarWeek<TDate>[]
}

/** A month entry for the year picker view. */
export interface YearEntry {
  /** Month index, 0-indexed (Jan = 0). */
  month: number
  /** Localized month name. */
  label: string
  /** Whether this is the current month. */
  isCurrent: boolean
}

/** A year entry for the decade picker view. */
export interface DecadeEntry {
  /** Full year number. */
  year: number
  /** Whether this is the current year. */
  isCurrent: boolean
}
