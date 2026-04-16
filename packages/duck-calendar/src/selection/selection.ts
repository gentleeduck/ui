import type { Adapter } from '../adapter'
import type { ICalendarDay, ICalendarWeek } from '../grid'
import { isDateDisabled, isInRange } from './selection.libs'
import type { CalendarValue, DateRange, ISelectionConstraints, SelectionMode } from './selection.types'

/**
 * Compute the next selection state when a day is clicked.
 * - **single**: click selects, click same deselects (returns null)
 * - **range**: 1st click = from, 2nd = to (auto-swap if before from), 3rd = reset
 * - **multi**: toggles the day in/out of the array
 */
export function selectDay<TDate, M extends SelectionMode>(
  adapter: Adapter.IDateAdapter<TDate>,
  mode: M,
  currentValue: CalendarValue<TDate, M>,
  clickedDay: TDate,
  options?: { shiftKey?: boolean },
): CalendarValue<TDate, M> {
  switch (mode) {
    case 'single':
      return selectSingle(adapter, currentValue as TDate | null, clickedDay) as CalendarValue<TDate, M>
    case 'range':
      return selectRange(adapter, currentValue as DateRange<TDate> | null, clickedDay) as CalendarValue<TDate, M>
    case 'multi':
      return selectMulti(adapter, currentValue as TDate[], clickedDay) as CalendarValue<TDate, M>
    case 'multi-range':
      return selectMultiRange(
        adapter,
        currentValue as DateRange<TDate>[],
        clickedDay,
        options?.shiftKey,
      ) as CalendarValue<TDate, M>
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

function selectSingle<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate | null, clicked: TDate): TDate | null {
  if (current !== null && adapter.isSameDay(current, clicked)) return null
  return clicked
}

function selectRange<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  current: DateRange<TDate> | null,
  clicked: TDate,
): DateRange<TDate> | null {
  if (current === null) {
    return { from: clicked, to: null }
  }

  // Click the start cell again while no end is set  -  deselect
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

function selectMulti<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate[], clicked: TDate): TDate[] {
  const exists = current.some((d) => adapter.isSameDay(d, clicked))
  if (exists) return current.filter((d) => !adapter.isSameDay(d, clicked))
  return [...current, clicked]
}

/**
 * Multi-range: accumulates completed ranges in an array.
 * The last entry may have `to: null` (in-progress). Once a range is completed,
 * clicking again starts a new range. Clicking a range-start of the in-progress
 * range cancels it.
 */
function selectMultiRange<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  current: DateRange<TDate>[],
  clicked: TDate,
  shiftKey?: boolean,
): DateRange<TDate>[] {
  // Shift+Click: split a range to exclude the clicked day (only for ranges > 5 days)
  if (shiftKey) {
    const idx = current.findIndex((range) => {
      if (range.to === null) return false
      return (
        (adapter.isSameDay(clicked, range.from) || adapter.isAfter(clicked, range.from)) &&
        (adapter.isSameDay(clicked, range.to) || adapter.isBefore(clicked, range.to))
      )
    })
    if (idx < 0) return current

    const range = current[idx]
    if (!range || range.to === null) return current

    // Count days in range (O(1) via native Date diff)
    const fromMs = adapter.toDate(range.from).getTime()
    const toMs = adapter.toDate(range.to).getTime()
    const dayCount = Math.round((toMs - fromMs) / 86_400_000) + 1
    if (dayCount <= 5) return current

    const result = current.filter((_, i) => i !== idx)

    // Clicking on range start: shrink from the left (exclude first day)
    if (adapter.isSameDay(clicked, range.from)) {
      result.push({ from: adapter.addDays(range.from, 1), to: range.to })
      return result
    }

    // Clicking on range end: shrink from the right (exclude last day)
    if (adapter.isSameDay(clicked, range.to)) {
      result.push({ from: range.from, to: adapter.addDays(range.to, -1) })
      return result
    }

    // Clicking in middle: split into two ranges excluding the clicked day
    const leftEnd = adapter.addDays(clicked, -1)
    const rightStart = adapter.addDays(clicked, 1)
    result.push({ from: range.from, to: leftEnd })
    result.push({ from: rightStart, to: range.to })
    return result
  }

  if (current.length === 0) {
    return [{ from: clicked, to: null }]
  }

  const last = current[current.length - 1]
  if (!last) return [{ from: clicked, to: null }]

  // Still selecting end of last range
  if (last.to === null) {
    // Click same start - cancel
    if (adapter.isSameDay(clicked, last.from)) {
      return current.slice(0, -1)
    }
    // Complete the range
    const completed = adapter.isBefore(clicked, last.from)
      ? { from: clicked, to: last.from }
      : { from: last.from, to: clicked }
    return mergeRanges(adapter, [...current.slice(0, -1), completed])
  }

  // All ranges are completed - start a new one
  return [...current, { from: clicked, to: null }]
}

/**
 * Merge overlapping or adjacent ranges into single ranges.
 * Two ranges merge if they overlap or one ends the day before the other starts.
 */
function mergeRanges<TDate>(adapter: Adapter.IDateAdapter<TDate>, ranges: DateRange<TDate>[]): DateRange<TDate>[] {
  const completed = ranges.filter((r) => r.to !== null) as { from: TDate; to: TDate }[]
  const inProgress = ranges.filter((r) => r.to === null)

  if (completed.length <= 1) return [...completed, ...inProgress]

  // Sort by start date
  completed.sort((a, b) => (adapter.isBefore(a.from, b.from) ? -1 : adapter.isAfter(a.from, b.from) ? 1 : 0))

  const first = completed[0]
  if (!first) return [...inProgress]
  const merged: DateRange<TDate>[] = [first]

  for (let i = 1; i < completed.length; i++) {
    const prev = merged[merged.length - 1] as { from: TDate; to: TDate }
    const curr = completed[i] as { from: TDate; to: TDate }

    // Check if curr overlaps or is adjacent (prev.to + 1 day >= curr.from)
    const prevEndPlusOne = adapter.addDays(prev.to, 1)
    const overlaps = adapter.isSameDay(curr.from, prevEndPlusOne) || adapter.isBefore(curr.from, prevEndPlusOne)

    if (overlaps) {
      // Merge: extend prev to the further end
      const newTo = adapter.isAfter(curr.to, prev.to) ? curr.to : prev.to
      merged[merged.length - 1] = { from: prev.from, to: newTo }
    } else {
      merged.push(curr)
    }
  }

  return [...merged, ...inProgress]
}

// -----------------------------------------------------------------------------
// applySelection
/**
 * Decorate a grid with selection, disabled, and range flags.
 * Takes the raw output of `buildCalendarMonth()` and fills in
 * `isSelected`, `isDisabled`, `isRangeStart`, `isRangeEnd`, `isRangeMiddle`.
 * Returns a new array  -  never mutates the input.
 */
export function applySelection<TDate, M extends SelectionMode>(
  weeks: ICalendarWeek<TDate>[],
  adapter: Adapter.IDateAdapter<TDate>,
  mode: M,
  selected: CalendarValue<TDate, M>,
  constraints: ISelectionConstraints<TDate> = {},
): ICalendarWeek<TDate>[] {
  return weeks.map((week) => ({
    ...week,
    days: week.days.map((day) => ({
      ...day,
      isDisabled: day.isDisabled || isDateDisabled(adapter, day.date, constraints),
      ...resolveSelectionFlags(adapter, mode, selected, day.date),
    })),
  }))
}

const UNSELECTED = Object.freeze({
  isSelected: false,
  isRangeStart: false,
  isRangeEnd: false,
  isRangeMiddle: false,
})

function resolveSelectionFlags<TDate, M extends SelectionMode>(
  adapter: Adapter.IDateAdapter<TDate>,
  mode: M,
  selected: CalendarValue<TDate, M>,
  date: TDate,
): Pick<ICalendarDay<TDate>, 'isSelected' | 'isRangeStart' | 'isRangeEnd' | 'isRangeMiddle'> {
  switch (mode) {
    case 'single': {
      const value = selected as TDate | null
      if (value === null || !adapter.isSameDay(date, value)) return UNSELECTED
      return { isSelected: true, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false }
    }

    case 'range': {
      const value = selected as DateRange<TDate> | null
      if (value === null) return UNSELECTED

      const { from, to } = value
      const isStart = adapter.isSameDay(date, from)
      const isEnd = to !== null && adapter.isSameDay(date, to)
      const isMid = to !== null && isInRange(adapter, date, value) && !isStart && !isEnd

      if (!isStart && !isEnd && !isMid) return UNSELECTED

      return {
        isSelected: isStart || isEnd,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
        isRangeMiddle: isMid,
      }
    }

    case 'multi': {
      const value = selected as TDate[]
      if (!value.some((d) => adapter.isSameDay(d, date))) return UNSELECTED
      return { isSelected: true, isRangeStart: false, isRangeEnd: false, isRangeMiddle: false }
    }

    case 'multi-range': {
      const ranges = selected as DateRange<TDate>[]
      for (const range of ranges) {
        const isStart = adapter.isSameDay(date, range.from)
        const isEnd = range.to !== null && adapter.isSameDay(date, range.to)
        const isMid = range.to !== null && isInRange(adapter, date, range) && !isStart && !isEnd

        if (isStart || isEnd || isMid) {
          return {
            isSelected: isStart || isEnd,
            isRangeStart: isStart,
            isRangeEnd: isEnd,
            isRangeMiddle: isMid,
          }
        }
      }
      return UNSELECTED
    }

    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}
