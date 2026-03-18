import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const WEEKDAYS_NAME = 'CalendarWeekdays'

type CalendarWeekdaysElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface CalendarWeekdaysProps extends PrimitiveDivProps {
  /** Render function for each weekday cell. Defaults to the localized weekday name. */
  renderWeekday?: (weekday: string, index: number) => React.ReactNode
}

export const CalendarWeekdays = React.forwardRef<CalendarWeekdaysElement, CalendarWeekdaysProps>(
  (props: ScopedProps<CalendarWeekdaysProps>, forwardedRef) => {
    const { __scopeCalendar, renderWeekday, children, ...weekdayProps } = props
    const context = useCalendarContext(WEEKDAYS_NAME, __scopeCalendar)
    const { weekdays } = context.state

    return (
      <Primitive.div role="row" data-slot="calendar-weekdays" {...weekdayProps} ref={forwardedRef}>
        {children ??
          weekdays.map((day, i) => (
            <abbr key={day} data-slot="calendar-weekday" title={day}>
              {renderWeekday ? renderWeekday(day, i) : day}
            </abbr>
          ))}
      </Primitive.div>
    )
  },
)

CalendarWeekdays.displayName = WEEKDAYS_NAME
