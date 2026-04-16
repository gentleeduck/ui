import type { Selection, UseCalendar } from '@gentleduck/calendar'
import { useCalendar } from '@gentleduck/calendar'
import * as React from 'react'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { ICalendar } from './calendar.types'

const CALENDAR_NAME = 'Calendar'

export const [createCalendarContext, createCalendarScope] = createContextScope(CALENDAR_NAME)

export const [CalendarProvider, useCalendarContext] = createCalendarContext<ICalendar.IContext>(CALENDAR_NAME)

type CalendarElement = React.ComponentRef<typeof Primitive.div>

const Calendar = React.forwardRef<CalendarElement, ICalendar.IRootProps>(
  (props: ICalendar.IScoped<ICalendar.IRootProps>, forwardedRef) => {
    const {
      __scopeCalendar,
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
      children,
      ...divProps
    } = props

    const config: UseCalendar.IUseCalendarConfig<Date, Selection.SelectionMode> = {
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

    const localeTag = locale?.locale
    const weekStartDay = locale?.weekStartDay
    const localeDirection = locale?.direction

    const { state, actions, getDayProps, getGridProps, getNavProps, getHeaderProps, announcer } = calendar

    const contextValue = React.useMemo<ICalendar.IContext>(() => {
      const resolvedLocale =
        localeTag || localeDirection || weekStartDay !== undefined
          ? { locale: localeTag, weekStartDay, direction: localeDirection }
          : undefined
      return {
        state,
        actions,
        getDayProps,
        getGridProps,
        getNavProps,
        getHeaderProps,
        announcer,
        adapter,
        mode,
        locale: resolvedLocale,
      }
    }, [
      state,
      actions,
      getDayProps,
      getGridProps,
      getNavProps,
      getHeaderProps,
      announcer,
      adapter,
      mode,
      localeTag,
      weekStartDay,
      localeDirection,
    ])

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
