import { buildDecadeView, goToYear } from '@gentleduck/calendar'
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const YEAR_VIEW_NAME = 'CalendarYearView'

type CalendarYearViewElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface CalendarYearViewProps extends PrimitiveDivProps {}

export const CalendarYearView = React.forwardRef<CalendarYearViewElement, CalendarYearViewProps>(
  (props: ScopedProps<CalendarYearViewProps>, forwardedRef) => {
    const { __scopeCalendar, children, ...viewProps } = props
    const context = useCalendarContext(YEAR_VIEW_NAME, __scopeCalendar)
    const { adapter } = context
    const { month } = context.state

    const years = React.useMemo(() => buildDecadeView(adapter, month), [adapter, month])

    return (
      <Primitive.div role="grid" data-slot="calendar-year-view" {...viewProps} ref={forwardedRef}>
        {children ??
          years.map((entry) => (
            <Primitive.button
              key={entry.year}
              type="button"
              role="gridcell"
              aria-label={`${entry.year}`}
              aria-current={entry.isCurrent ? 'date' : undefined}
              data-slot="calendar-year"
              data-current={entry.isCurrent ? 'true' : undefined}
              data-year={entry.year}
              onClick={() => {
                context.actions.setMonth(goToYear(adapter, month, entry.year))
                context.actions.setViewMode('months')
              }}>
              {entry.year}
            </Primitive.button>
          ))}
      </Primitive.div>
    )
  },
)

CalendarYearView.displayName = YEAR_VIEW_NAME
