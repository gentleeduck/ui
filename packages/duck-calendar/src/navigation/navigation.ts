import type { Adapter } from '../adapter'
import type { Selection } from '../selection'

/** Direction to navigate: backward or forward. */
export type NavigationDirection = 'prev' | 'next'
/** Unit to navigate by: one month, one year, or ten years. */
export type NavigationUnit = 'month' | 'year' | 'decade'

/** Move the view date by one unit in the given direction. */
export function navigate<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  date: TDate,
  direction: NavigationDirection,
  unit: NavigationUnit,
): TDate {
  const sign = direction === 'next' ? 1 : -1

  switch (unit) {
    case 'month':
      return adapter.addMonths(date, sign)
    case 'year':
      return adapter.addYears(date, sign)
    case 'decade':
      return adapter.addYears(date, sign * 10)
    default: {
      const _exhaustive: never = unit
      return _exhaustive
    }
  }
}

/** Check if navigation in the given direction is within fromDate/toDate bounds. */
export function canNavigate<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  date: TDate,
  direction: NavigationDirection,
  unit: NavigationUnit,
  constraints: Pick<Selection.ISelectionConstraints<TDate>, 'fromDate' | 'toDate'> = {},
): boolean {
  const { fromDate, toDate } = constraints

  if (direction === 'prev' && fromDate === undefined) return true
  if (direction === 'next' && toDate === undefined) return true

  const target = navigate(adapter, date, direction, unit)

  if (direction === 'prev' && fromDate !== undefined) {
    const targetEnd = adapter.endOfMonth(target)
    return !adapter.isBefore(targetEnd, fromDate)
  }

  if (direction === 'next' && toDate !== undefined) {
    const targetStart = adapter.startOfMonth(target)
    return !adapter.isAfter(targetStart, toDate)
  }

  return true
}

export function goToNextMonth<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate): TDate {
  return adapter.addMonths(current, 1)
}

export function goToPrevMonth<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate): TDate {
  return adapter.addMonths(current, -1)
}

/**
 * Jumps to a specific month within the same year.
 * @param month - 0-indexed month (0 = January, 11 = December).
 */
export function goToMonth<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate, month: number): TDate {
  return adapter.create(adapter.getYear(current), month, 1)
}

/**
 * Jumps to the same month in a different year.
 */
export function goToYear<TDate>(adapter: Adapter.IDateAdapter<TDate>, current: TDate, year: number): TDate {
  return adapter.create(year, adapter.getMonth(current), 1)
}
