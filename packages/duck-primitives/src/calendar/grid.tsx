import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const GRID_NAME = 'CalendarGrid'

type CalendarGridElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface ICalendarGridProps extends PrimitiveDivProps {}

export const CalendarGrid = React.forwardRef<CalendarGridElement, ICalendarGridProps>(
  (props: ScopedProps<ICalendarGridProps>, forwardedRef) => {
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
