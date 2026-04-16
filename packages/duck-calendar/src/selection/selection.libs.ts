import type { Adapter } from '../adapter'
import type { DateRange, ISelectionConstraints } from './selection.types'

/**
 * Returns `true` when `date` should be non-interactive.
 *
 * Checks in order:
 * 1. Predicate / array from `constraints.disabled`
 * 2. Before `constraints.fromDate`
 * 3. After `constraints.toDate`
 */
export function isDateDisabled<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  date: TDate,
  constraints: ISelectionConstraints<TDate>,
): boolean {
  const { disabled, fromDate, toDate } = constraints

  if (disabled) {
    if (typeof disabled === 'function') {
      if (disabled(date)) return true
    } else {
      if (disabled.some((d: TDate) => adapter.isSameDay(d, date))) return true
    }
  }

  if (fromDate && adapter.isBefore(date, fromDate)) return true
  if (toDate && adapter.isAfter(date, toDate)) return true

  return false
}

/**
 * Returns `true` when `date` falls inside `range` (inclusive on both ends).
 * Returns `false` when `range.to` is null (range is still being selected).
 */
export function isInRange<TDate>(adapter: Adapter.IDateAdapter<TDate>, date: TDate, range: DateRange<TDate>): boolean {
  if (range.to === null) return false

  const { from, to } = range

  // normalise so from is always the earlier end
  const [start, end] = adapter.isBefore(from, to) ? [from, to] : [to, from]

  return (
    (adapter.isSameDay(date, start) || adapter.isAfter(date, start)) &&
    (adapter.isSameDay(date, end) || adapter.isBefore(date, end))
  )
}
