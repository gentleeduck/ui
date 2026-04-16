import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { Primitive } from '../primitive-elements'
import { useCalendarContext } from './calendar'
import type { ICalendar } from './calendar.types'

const NAV_NAME = 'CalendarNav'
const NAV_BUTTON_NAME = 'CalendarNavButton'

type CalendarNavElement = React.ComponentRef<typeof Primitive.div>
type CalendarNavButtonElement = React.ComponentRef<typeof Primitive.button>

export const CalendarNav = React.forwardRef<CalendarNavElement, ICalendar.INavProps>(
  (props: ICalendar.IScoped<ICalendar.INavProps>, forwardedRef) => {
    const { __scopeCalendar, children, ...navProps } = props
    useCalendarContext(NAV_NAME, __scopeCalendar)

    return (
      <Primitive.div
        role="navigation"
        data-slot="calendar-nav"
        aria-label="Calendar navigation"
        {...navProps}
        ref={forwardedRef}>
        {children ?? (
          <>
            <CalendarPrevButton __scopeCalendar={__scopeCalendar} />
            <CalendarNextButton __scopeCalendar={__scopeCalendar} />
          </>
        )}
      </Primitive.div>
    )
  },
)

CalendarNav.displayName = NAV_NAME

export const CalendarPrevButton = React.forwardRef<CalendarNavButtonElement, ICalendar.IPrevButtonProps>(
  (props: ICalendar.IScoped<ICalendar.IPrevButtonProps>, forwardedRef) => {
    const { __scopeCalendar, ...buttonProps } = props
    const context = useCalendarContext(NAV_BUTTON_NAME, __scopeCalendar)
    const navProps = context.getNavProps('prev')

    return (
      <Primitive.button
        type="button"
        data-slot="calendar-nav-button"
        data-direction="prev"
        aria-label={navProps['aria-label']}
        disabled={navProps.disabled}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, navProps.onClick)}
      />
    )
  },
)

CalendarPrevButton.displayName = 'CalendarPrevButton'

export const CalendarNextButton = React.forwardRef<CalendarNavButtonElement, ICalendar.INextButtonProps>(
  (props: ICalendar.IScoped<ICalendar.INextButtonProps>, forwardedRef) => {
    const { __scopeCalendar, ...buttonProps } = props
    const context = useCalendarContext(NAV_BUTTON_NAME, __scopeCalendar)
    const navProps = context.getNavProps('next')

    return (
      <Primitive.button
        type="button"
        data-slot="calendar-nav-button"
        data-direction="next"
        aria-label={navProps['aria-label']}
        disabled={navProps.disabled}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, navProps.onClick)}
      />
    )
  },
)

CalendarNextButton.displayName = 'CalendarNextButton'
