import type { DateAdapter } from '../adapter'
import type { CalendarConfig } from '../index.types'
import { getLocalizedMonthNames, getWeekNumber } from './grid.libs'
import type { CalendarDay, CalendarMonth, CalendarWeek, DecadeEntry, YearEntry } from './grid.types'

/**
 * Build a 2D grid of day cells for a given month.
 * Returns weeks × 7 days. Selection flags default to `false` — use `applySelection()` to fill them.
 */
export function buildCalendarMonth<TDate>(
  adapter: DateAdapter<TDate>,
  viewDate: TDate,
  config: Pick<CalendarConfig<TDate, any>, 'showOutsideDays' | 'fixedWeeks' | 'locale'>,
): CalendarMonth<TDate> {
  const weekStartDay = config.locale?.weekStartDay ?? 0
  const today = adapter.today()

  const firstOfMonth = adapter.startOfMonth(viewDate)
  const lastOfMonth = adapter.endOfMonth(viewDate)

  // first cell in the grid — may be in the previous month
  let cursor = adapter.startOfWeek(firstOfMonth, weekStartDay)

  const weeks: CalendarWeek<TDate>[] = []
  const targetMonth = adapter.getMonth(viewDate)
  const targetYear = adapter.getYear(viewDate)

  const shouldStop = (cursor: TDate, weeksBuilt: number): boolean => {
    if (config.fixedWeeks) return weeksBuilt >= 6
    // stop once we've passed the end of the month and completed the week
    return weeksBuilt > 0 && adapter.isAfter(cursor, lastOfMonth)
  }

  while (!shouldStop(cursor, weeks.length)) {
    const days: CalendarDay<TDate>[] = []

    for (let i = 0; i < 7; i++) {
      const isOutside = adapter.getMonth(cursor) !== targetMonth || adapter.getYear(cursor) !== targetYear

      const dayOfWeek = adapter.getDayOfWeek(cursor)

      days.push({
        date: cursor,
        isToday: adapter.isSameDay(cursor, today),
        isOutside,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        // selection module fills these
        isSelected: false,
        isDisabled: false,
        isRangeStart: false,
        isRangeEnd: false,
        isRangeMiddle: false,
      })

      cursor = adapter.addDays(cursor, 1)
    }

    weeks.push({
      weekNumber: getWeekNumber(adapter, days[0]?.date),
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
  adapter: DateAdapter<TDate>,
  startMonth: TDate,
  count: number,
  config: Pick<CalendarConfig<TDate, any>, 'showOutsideDays' | 'fixedWeeks' | 'locale'>,
): CalendarMonth<TDate>[] {
  const months: CalendarMonth<TDate>[] = []
  for (let i = 0; i < count; i++) {
    const monthDate = i === 0 ? startMonth : adapter.addMonths(startMonth, i)
    months.push(buildCalendarMonth(adapter, monthDate, config))
  }
  return months
}

/** Build 12 month entries for the year picker view. */
export function buildCalendarYear<TDate>(adapter: DateAdapter<TDate>, viewDate: TDate, locale?: string): YearEntry[] {
  const today = adapter.today()
  const currentMonth = adapter.getMonth(today)
  const currentYear = adapter.getYear(today)
  const viewYear = adapter.getYear(viewDate)

  const monthNames = getLocalizedMonthNames(adapter, locale)

  return monthNames.map((label, month) => ({
    month,
    label,
    isCurrent: month === currentMonth && viewYear === currentYear,
  }))
}

/** Build 12 year entries for the decade picker (decade + 1 before/after for context). */
export function buildDecadeView<TDate>(adapter: DateAdapter<TDate>, viewDate: TDate): DecadeEntry[] {
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
