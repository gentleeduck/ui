import type { DateAdapter } from '../adapter'
import type { CalendarDay, CalendarWeek } from '../grid'
import { isDateDisabled, isInRange } from './selection.libs'
import type { CalendarValue, DateRange, SelectionConstraints, SelectionMode } from './selection.types'

/**
 * Compute the next selection state when a day is clicked.
 * - **single**: click selects, click same deselects (returns null)
 * - **range**: 1st click = from, 2nd = to (auto-swap if before from), 3rd = reset
 * - **multi**: toggles the day in/out of the array
 */
export function selectDay<TDate, M extends SelectionMode>(
  adapter: DateAdapter<TDate>,
  mode: M,
  currentValue: CalendarValue<TDate, M>,
  clickedDay: TDate,
): CalendarValue<TDate, M> {
  switch (mode) {
    case 'single':
      return selectSingle(adapter, currentValue as TDate | null, clickedDay) as CalendarValue<TDate, M>
    case 'range':
      return selectRange(adapter, currentValue as DateRange<TDate> | null, clickedDay) as CalendarValue<TDate, M>
    case 'multi':
      return selectMulti(adapter, currentValue as TDate[], clickedDay) as CalendarValue<TDate, M>
    default:
      return currentValue
  }
}

function selectSingle<TDate>(adapter: DateAdapter<TDate>, current: TDate | null, clicked: TDate): TDate | null {
  if (current !== null && adapter.isSameDay(current, clicked)) return null
  return clicked
}

function selectRange<TDate>(
  adapter: DateAdapter<TDate>,
  current: DateRange<TDate> | null,
  clicked: TDate,
): DateRange<TDate> | null {
  if (current === null) {
    return { from: clicked, to: null }
  }

  // Click the start cell again while no end is set — deselect
  if (current.to === null && adapter.isSameDay(clicked, current.from)) {
    return null
  }

  if (current.to !== null) {
    return { from: clicked, to: null }
  }

  if (adapter.isBefore(clicked, current.from)) {
    return { from: clicked, to: current.from }
  }

  return { from: current.from, to: clicked }
}

function selectMulti<TDate>(adapter: DateAdapter<TDate>, current: TDate[], clicked: TDate): TDate[] {
  const exists = current.some((d) => adapter.isSameDay(d, clicked))
  if (exists) return current.filter((d) => !adapter.isSameDay(d, clicked))
  return [...current, clicked]
}

// -----------------------------------------------------------------------------
// applySelection
/**
 * Decorate a grid with selection, disabled, and range flags.
 * Takes the raw output of `buildCalendarMonth()` and fills in
 * `isSelected`, `isDisabled`, `isRangeStart`, `isRangeEnd`, `isRangeMiddle`.
 * Returns a new array — never mutates the input.
 */
export function applySelection<TDate, M extends SelectionMode>(
  weeks: CalendarWeek<TDate>[],
  adapter: DateAdapter<TDate>,
  mode: M,
  selected: CalendarValue<TDate, M>,
  constraints: SelectionConstraints<TDate> = {},
): CalendarWeek<TDate>[] {
  return weeks.map((week) => ({
    ...week,
    days: week.days.map((day) => ({
      ...day,
      isDisabled: isDateDisabled(adapter, day.date, constraints),
      ...resolveSelectionFlags(adapter, mode, selected, day.date),
    })),
  }))
}

function resolveSelectionFlags<TDate, M extends SelectionMode>(
  adapter: DateAdapter<TDate>,
  mode: M,
  selected: CalendarValue<TDate, M>,
  date: TDate,
): Pick<CalendarDay<TDate>, 'isSelected' | 'isRangeStart' | 'isRangeEnd' | 'isRangeMiddle'> {
  const none = {
    isSelected: false,
    isRangeStart: false,
    isRangeEnd: false,
    isRangeMiddle: false,
  }

  switch (mode) {
    case 'single': {
      const value = selected as TDate | null
      return { ...none, isSelected: value !== null && adapter.isSameDay(date, value) }
    }

    case 'range': {
      const value = selected as DateRange<TDate> | null
      if (value === null) return none

      const { from, to } = value
      const isStart = adapter.isSameDay(date, from)
      const isEnd = to !== null && adapter.isSameDay(date, to)
      const isMid = to !== null && isInRange(adapter, date, value) && !isStart && !isEnd

      return {
        isSelected: isStart || isEnd,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
        isRangeMiddle: isMid,
      }
    }

    case 'multi': {
      const value = selected as TDate[]
      return { ...none, isSelected: value.some((d) => adapter.isSameDay(d, date)) }
    }

    default:
      return none
  }
}
