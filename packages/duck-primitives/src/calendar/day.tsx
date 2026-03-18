import type { CalendarDay as CalendarDayType } from '@gentleduck/calendar'
import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const DAY_NAME = 'CalendarDay'

type CalendarDayElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

export interface CalendarDayProps extends PrimitiveButtonProps {
  /** The day data from the calendar grid. */
  day: CalendarDayType<Date>
}

export const CalendarDay = React.forwardRef<CalendarDayElement, CalendarDayProps>(
  (props: ScopedProps<CalendarDayProps>, forwardedRef) => {
    const { __scopeCalendar, day, children, ...buttonProps } = props
    const context = useCalendarContext(DAY_NAME, __scopeCalendar)
    const dayDomProps = context.getDayProps(day)

    return (
      <Primitive.button
        type="button"
        data-slot="calendar-day"
        {...dayDomProps}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, dayDomProps.onClick)}
        onMouseEnter={composeEventHandlers(props.onMouseEnter, dayDomProps.onMouseEnter)}
        onKeyDown={composeEventHandlers(props.onKeyDown, dayDomProps.onKeyDown)}>
        {children ?? day.date.getDate()}
      </Primitive.button>
    )
  },
)

CalendarDay.displayName = DAY_NAME
