import type { Adapter } from '../adapter'
import type { Calendar } from '../index.types'
import { getLocalizedMonthNames, getWeekNumber } from './grid.libs'
import type { Grid } from './grid.types'

/**
 * Build a 2D grid of day cells for a given month.
 * Returns weeks x 7 days. Selection flags default to `false`  -  use `applySelection()` to fill them.
 */
export function buildCalendarMonth<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  viewDate: TDate,
  config: Pick<Calendar.ICalendarConfig<TDate, 'single'>, 'showOutsideDays' | 'fixedWeeks' | 'locale'>,
): Grid.ICalendarMonth<TDate> {
  const weekStartDay = config.locale?.weekStartDay ?? 0
  const showOutsideDays = config.showOutsideDays ?? true
  const today = adapter.today()

  const firstOfMonth = adapter.startOfMonth(viewDate)
  const lastOfMonth = adapter.endOfMonth(viewDate)

  // first cell in the grid  -  may be in the previous month
  let cursor = adapter.startOfWeek(firstOfMonth, weekStartDay)

  const weeks: Grid.ICalendarWeek<TDate>[] = []
  const targetMonth = adapter.getMonth(viewDate)
  const targetYear = adapter.getYear(viewDate)

  const shouldStop = (cursor: TDate, weeksBuilt: number): boolean => {
    if (config.fixedWeeks) return weeksBuilt >= 6
    // stop once we've passed the end of the month and completed the week
    return weeksBuilt > 0 && adapter.isAfter(cursor, lastOfMonth)
  }

  while (!shouldStop(cursor, weeks.length)) {
    const days: Grid.ICalendarDay<TDate>[] = []

    for (let i = 0; i < 7; i++) {
      const isOutside = adapter.getMonth(cursor) !== targetMonth || adapter.getYear(cursor) !== targetYear

      const dayOfWeek = adapter.getDayOfWeek(cursor)

      days.push({
        date: cursor,
        isToday: !isOutside && adapter.isSameDay(cursor, today),
        isOutside,
        isHidden: isOutside && !showOutsideDays,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        // selection module fills these
        isSelected: false,
        isDisabled: isOutside && !showOutsideDays,
        isRangeStart: false,
        isRangeEnd: false,
        isRangeMiddle: false,
      })

      cursor = adapter.addDays(cursor, 1)
    }

    weeks.push({
      // biome-ignore lint/style/noNonNullAssertion: days always has exactly 7 elements from the inner loop
      weekNumber: getWeekNumber(adapter, days[0]!.date),
      days,
    })
  }

  return {
    month: firstOfMonth,
    weeks,
  }
}

/**
 * Build grids for multiple consecutive months.
 * Used when `numberOfMonths > 1` for multi-month calendar displays.
 */
export function buildMultiMonth<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  startMonth: TDate,
  count: number,
  config: Pick<Calendar.ICalendarConfig<TDate, 'single'>, 'showOutsideDays' | 'fixedWeeks' | 'locale'>,
): Grid.ICalendarMonth<TDate>[] {
  const months: Grid.ICalendarMonth<TDate>[] = []
  for (let i = 0; i < count; i++) {
    const monthDate = i === 0 ? startMonth : adapter.addMonths(startMonth, i)
    months.push(buildCalendarMonth(adapter, monthDate, config))
  }
  return months
}

/**
 * Build month entries for the year picker view.
 *
 * Queries the adapter for the actual month count to support calendar systems
 * with variable months (e.g. Hebrew leap years with 13 months).
 */
export function buildCalendarYear<TDate>(
  adapter: Adapter.IDateAdapter<TDate>,
  viewDate: TDate,
  locale?: string,
): Grid.IYearEntry[] {
  const today = adapter.today()
  const currentMonth = adapter.getMonth(today)
  const currentYear = adapter.getYear(today)
  const viewYear = adapter.getYear(viewDate)

  const monthNames = getLocalizedMonthNames(adapter, viewYear, locale)

  return monthNames.map((label, month) => ({
    month,
    label,
    isCurrent: month === currentMonth && viewYear === currentYear,
  }))
}

/** Build 12 year entries for the decade picker (decade + 1 before/after for context). */
export function buildDecadeView<TDate>(adapter: Adapter.IDateAdapter<TDate>, viewDate: TDate): Grid.IDecadeEntry[] {
  const today = adapter.today()
  const currentYear = adapter.getYear(today)
  const viewYear = adapter.getYear(viewDate)

  // decade start: floor to nearest 10, then go 1 before for context
  const decadeStart = Math.floor(viewYear / 10) * 10 - 1

  return Array.from({ length: 12 }, (_, i) => {
    const year = decadeStart + i
    return {
      year,
      isCurrent: year === currentYear,
    }
  })
}
