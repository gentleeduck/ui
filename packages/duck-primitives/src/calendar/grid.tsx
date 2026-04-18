import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { useCalendarContext } from './calendar'
import type { ICalendar } from './calendar.types'

const GRID_NAME = 'CalendarGrid'

type CalendarGridElement = React.ComponentRef<typeof Primitive.div>

export const CalendarGrid = React.forwardRef<CalendarGridElement, ICalendar.IGridProps>(
  (props: ICalendar.IScoped<ICalendar.IGridProps>, forwardedRef) => {
    const { __scopeCalendar, children, ...gridProps } = props
    const context = useCalendarContext(GRID_NAME, __scopeCalendar)
    const gridDomProps = context.getGridProps()

    return (
      <Primitive.div data-slot="calendar-grid" {...gridDomProps} {...gridProps} ref={forwardedRef}>
        {children}
      </Primitive.div>
    )
  },
)

CalendarGrid.displayName = GRID_NAME
