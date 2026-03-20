import type {
  CalendarLocaleConfig,
  DateAdapter,
  SelectionMode,
  UseCalendarConfig,
  UseCalendarReturn,
} from '@gentleduck/calendar'
import { useCalendar } from '@gentleduck/calendar'
import * as React from 'react'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const CALENDAR_NAME = 'Calendar'

export type ScopedProps<P> = P & { __scopeCalendar?: Scope }

export const [createCalendarContext, createCalendarScope] = createContextScope(CALENDAR_NAME)

export type CalendarContextValue = UseCalendarReturn<Date, SelectionMode> & {
  adapter: DateAdapter<Date>
  mode: SelectionMode
  locale?: CalendarLocaleConfig
}

export const [CalendarProvider, useCalendarContext] = createCalendarContext<CalendarContextValue>(CALENDAR_NAME)

type CalendarElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

/** Props that conflict between HTMLDivElement and CalendarConfig. */
type ConflictingProps = 'onSelect' | 'disabled' | 'children'

export interface CalendarRootProps
  extends Omit<PrimitiveDivProps, ConflictingProps>,
    UseCalendarConfig<Date, SelectionMode> {
  children?: React.ReactNode
}

const Calendar = React.forwardRef<CalendarElement, CalendarRootProps>(
  (props: ScopedProps<CalendarRootProps>, forwardedRef) => {
    const {
      __scopeCalendar,
      // UseCalendarConfig props
      adapter,
      mode,
      locale,
      month,
      defaultMonth,
      selected,
      defaultSelected,
      onSelect,
      onMonthChange,
      onDismiss,
      numberOfMonths,
      showOutsideDays,
      fixedWeeks,
      disabled,
      fromDate,
      toDate,
      // DOM props
      children,
      ...divProps
    } = props

    const config: UseCalendarConfig<Date, SelectionMode> = {
      adapter,
      mode,
      locale,
      month,
      defaultMonth,
      selected,
      defaultSelected,
      onSelect,
      onMonthChange,
      onDismiss,
      numberOfMonths,
      showOutsideDays,
      fixedWeeks,
      disabled,
      fromDate,
      toDate,
    }

    const calendar = useCalendar(config)

    const contextValue = React.useMemo<CalendarContextValue>(
      () => ({ ...calendar, adapter, mode, locale }),
      // Use primitive deps from calendar.state to avoid rebuilds on locale object identity changes
      // biome-ignore lint/correctness/useExhaustiveDependencies: calendar already captures internal state changes
      [calendar, adapter, mode, locale?.locale, locale?.weekStartDay, locale?.direction],
    )

    return (
      <CalendarProvider scope={__scopeCalendar} {...contextValue}>
        <Primitive.div
          role="application"
          aria-label="Calendar"
          data-slot="calendar"
          data-view={calendar.state.viewMode}
          {...divProps}
          ref={forwardedRef}>
          {children}
          <calendar.announcer.AnnouncerPortal />
        </Primitive.div>
      </CalendarProvider>
    )
  },
)

Calendar.displayName = CALENDAR_NAME

export { Calendar }
