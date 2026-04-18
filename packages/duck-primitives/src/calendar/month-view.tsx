import { buildCalendarYear, goToMonth } from '@gentleduck/calendar'
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useCalendarContext } from './calendar'
import type { ICalendar } from './calendar.types'

const MONTH_VIEW_NAME = 'CalendarMonthView'

type CalendarMonthViewElement = React.ComponentRef<typeof Primitive.div>

export const CalendarMonthView = React.forwardRef<CalendarMonthViewElement, ICalendar.IMonthViewProps>(
  (props: ICalendar.IScoped<ICalendar.IMonthViewProps>, forwardedRef) => {
    const { __scopeCalendar, children, ...viewProps } = props
    const context = useCalendarContext(MONTH_VIEW_NAME, __scopeCalendar)
    const { adapter, locale } = context
    const { month } = context.state

    const localeTag = locale?.locale
    const months = React.useMemo(() => buildCalendarYear(adapter, month, localeTag), [adapter, month, localeTag])

    const handleMonthSelect = React.useCallback(
      (monthIndex: number) => {
        context.actions.setMonth(goToMonth(adapter, month, monthIndex))
        context.actions.setViewMode('days')
      },
      [adapter, month, context.actions],
    )

    return (
      <Primitive.div role="grid" data-slot="calendar-month-view" {...viewProps} ref={forwardedRef}>
        {children ??
          months.map((entry) => (
            <Primitive.button
              key={entry.month}
              type="button"
              role="gridcell"
              aria-label={entry.label}
              aria-current={entry.isCurrent ? 'date' : undefined}
              data-slot="calendar-month"
              data-current={entry.isCurrent ? 'true' : undefined}
              data-month={entry.month}
              onClick={() => handleMonthSelect(entry.month)}>
              {entry.label}
            </Primitive.button>
          ))}
      </Primitive.div>
    )
  },
)

CalendarMonthView.displayName = MONTH_VIEW_NAME
