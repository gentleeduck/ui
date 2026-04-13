import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import type { Scope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import { type ScopedProps, useCalendarContext } from './calendar'

const NAV_NAME = 'CalendarNav'
const NAV_BUTTON_NAME = 'CalendarNavButton'

// ---------------------------------------------------------------------------
// CalendarNav  -  wrapper for prev/next buttons
// ---------------------------------------------------------------------------

type CalendarNavElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

export interface ICalendarNavProps extends PrimitiveDivProps {}

export const CalendarNav = React.forwardRef<CalendarNavElement, ICalendarNavProps>(
  (props: ScopedProps<ICalendarNavProps>, forwardedRef) => {
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

// ---------------------------------------------------------------------------
// CalendarPrevButton
// ---------------------------------------------------------------------------

type CalendarNavButtonElement = React.ComponentRef<typeof Primitive.button>
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

export interface ICalendarPrevButtonProps extends PrimitiveButtonProps {
  __scopeCalendar?: Scope
}

export const CalendarPrevButton = React.forwardRef<CalendarNavButtonElement, ICalendarPrevButtonProps>(
  (props: ScopedProps<ICalendarPrevButtonProps>, forwardedRef) => {
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

// ---------------------------------------------------------------------------
// CalendarNextButton
// ---------------------------------------------------------------------------

export interface ICalendarNextButtonProps extends PrimitiveButtonProps {
  __scopeCalendar?: Scope
}

export const CalendarNextButton = React.forwardRef<CalendarNavButtonElement, ICalendarNextButtonProps>(
  (props: ScopedProps<ICalendarNextButtonProps>, forwardedRef) => {
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
