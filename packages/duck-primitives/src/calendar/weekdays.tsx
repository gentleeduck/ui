import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const WEEKDAYS_NAME = 'CalendarWeekdays'

type CalendarWeekdaysElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface ICalendarWeekdaysProps extends PrimitiveDivProps {
  /** Render function for each weekday cell. Defaults to the localized weekday name. */
  renderWeekday?: (weekday: string, index: number) => React.ReactNode
}

export const CalendarWeekdays = React.forwardRef<CalendarWeekdaysElement, ICalendarWeekdaysProps>(
  (props: ScopedProps<ICalendarWeekdaysProps>, forwardedRef) => {
    const { __scopeCalendar, renderWeekday, children, ...weekdayProps } = props
    const context = useCalendarContext(WEEKDAYS_NAME, __scopeCalendar)
    const { weekdays } = context.state

    return (
      <Primitive.div role="row" data-slot="calendar-weekdays" {...weekdayProps} ref={forwardedRef}>
        {children ??
          weekdays.map((day, i) => <WeekdayCell key={day} day={day} index={i} renderWeekday={renderWeekday} />)}
      </Primitive.div>
    )
  },
)

CalendarWeekdays.displayName = WEEKDAYS_NAME

/** Internal weekday cell with biome suppression for a11y roles. */
function WeekdayCell({
  day,
  index,
  renderWeekday,
}: {
  day: string
  index: number
  renderWeekday?: (weekday: string, index: number) => React.ReactNode
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: columnheader role on abbr is intentional per WAI-ARIA grid pattern
    <abbr role="columnheader" data-slot="calendar-weekday" title={day}>
      {renderWeekday ? renderWeekday(day, index) : day}
    </abbr>
  )
}
