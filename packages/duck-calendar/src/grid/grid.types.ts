/**
 * Represents a single cell in the calendar grid.
 *
 * Carries the raw date plus every boolean flag the renderer needs
 * so that rendering logic stays pure and stateless.
 *
 * @typeParam TDate - The adapter's date type.
 */
export interface CalendarDay<TDate> {
  /** The calendar date this cell represents. */
  date: TDate

  /** `true` when this date equals today (per the adapter's `today()`). */
  isToday: boolean

  /**
   * `true` when this date is part of the current selection.
   * In range mode this covers the start, middle, and end of the range.
   */
  isSelected: boolean

  /**
   * `true` when this date cannot be selected by the user.
   * Caused by `disabled`, `fromDate`, or `toDate` constraints in
   * {@link CalendarConfig}.
   */
  isDisabled: boolean

  /**
   * `true` when this date belongs to the previous or next month.
   * Only populated when `showOutsideDays` is `true` in
   * {@link CalendarConfig}.
   */
  isOutside: boolean

  /**
   * `true` when this is the first date in an active range selection.
   * Always `false` in `single` and `multi` modes.
   */
  isRangeStart: boolean

  /**
   * `true` when this is the last date in an active range selection.
   * Always `false` in `single` and `multi` modes.
   */
  isRangeEnd: boolean

  /**
   * `true` when this date falls between (exclusive) the range start and end.
   * Always `false` in `single` and `multi` modes.
   */
  isRangeMiddle: boolean
}

/**
 * One row in the calendar grid, corresponding to a single week.
 *
 * A month grid is always 7 days wide; the number of rows varies between
 * 4 and 6 depending on the month (or is fixed at 6 when `fixedWeeks` is set).
 *
 * @typeParam TDate - The adapter's date type.
 */
export interface CalendarWeek<TDate> {
  /**
   * ISO week number (1–53) for this row.
   * Useful for rendering week-number gutter columns.
   */
  weekNumber: number

  /**
   * The seven days in this row, ordered from `weekStartDay` to
   * `weekStartDay + 6`. Always exactly 7 elements.
   */
  days: CalendarDay<TDate>[]
}

/**
 * The complete grid for one calendar panel (one month view).
 *
 * When `numberOfMonths > 1`, the engine produces one `CalendarMonth`
 * per visible panel.
 *
 * @typeParam TDate - The adapter's date type.
 */
export interface CalendarMonth<TDate> {
  /**
   * A date within this month, always normalized to the 1st day.
   * Pass directly to adapter methods like `getMonth()` or `format()`.
   */
  month: TDate

  /**
   * The week rows that make up the grid.
   * Contains 4–6 rows normally, always 6 when `fixedWeeks` is enabled.
   */
  weeks: CalendarWeek<TDate>[]
}
