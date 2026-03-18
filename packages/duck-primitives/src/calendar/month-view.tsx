import { buildCalendarYear, goToMonth } from '@gentleduck/calendar'
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const MONTH_VIEW_NAME = 'CalendarMonthView'

type CalendarMonthViewElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface CalendarMonthViewProps extends PrimitiveDivProps {}

export const CalendarMonthView = React.forwardRef<CalendarMonthViewElement, CalendarMonthViewProps>(
  (props: ScopedProps<CalendarMonthViewProps>, forwardedRef) => {
    const { __scopeCalendar, children, ...viewProps } = props
    const context = useCalendarContext(MONTH_VIEW_NAME, __scopeCalendar)
    const { adapter, locale } = context
    const { month } = context.state

    const months = React.useMemo(() => buildCalendarYear(adapter, month, locale?.locale), [adapter, month, locale])

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
              onClick={() => {
                context.actions.setMonth(goToMonth(adapter, month, entry.month))
                context.actions.setViewMode('days')
              }}>
              {entry.label}
            </Primitive.button>
          ))}
      </Primitive.div>
    )
  },
)

CalendarMonthView.displayName = MONTH_VIEW_NAME
