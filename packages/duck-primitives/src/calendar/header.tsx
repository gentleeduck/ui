import type { IDateAdapter } from '@gentleduck/calendar'
import * as React from 'react'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const HEADER_NAME = 'CalendarHeader'

type CalendarHeaderElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface ICalendarHeaderProps extends PrimitiveDivProps {
  /** Custom formatter for the month/year title. Defaults to "March 2026". */
  formatMonth?: (month: Date, adapter: IDateAdapter<Date>) => string
}

export const CalendarHeader = React.forwardRef<CalendarHeaderElement, ICalendarHeaderProps>(
  (props: ScopedProps<ICalendarHeaderProps>, forwardedRef) => {
    const { __scopeCalendar, formatMonth, children, ...headerProps } = props
    const context = useCalendarContext(HEADER_NAME, __scopeCalendar)
    const { adapter, locale } = context
    const { month } = context.state

    const headerDomProps = context.getHeaderProps()

    const title = formatMonth
      ? formatMonth(month, adapter)
      : adapter.format(month, { month: 'long', year: 'numeric' }, locale?.locale)

    return (
      <Primitive.div data-slot="calendar-header" {...headerDomProps} {...headerProps} ref={forwardedRef}>
        {children ?? title}
      </Primitive.div>
    )
  },
)

CalendarHeader.displayName = HEADER_NAME
