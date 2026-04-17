import type { Adapter, Calendar as CalendarTypes, Selection, UseCalendar } from '@gentleduck/calendar'
import { useCalendar } from '@gentleduck/calendar'
import * as React from 'react'
import type { Scope } from '../libs/create-context'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'

const CALENDAR_NAME = 'Calendar'

export type ScopedProps<P> = P & { __scopeCalendar?: Scope }

export const [createCalendarContext, createCalendarScope] = createContextScope(CALENDAR_NAME)

export type CalendarContextValue = UseCalendar.IUseCalendarReturn<Date, Selection.SelectionMode> & {
  adapter: Adapter.IDateAdapter<Date>
  mode: Selection.SelectionMode
  locale?: CalendarTypes.ICalendarLocaleConfig
}

export const [CalendarProvider, useCalendarContext] = createCalendarContext<CalendarContextValue>(CALENDAR_NAME)

type CalendarElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

/** Props that conflict between HTMLDivElement and ICalendarConfig. */
type ConflictingProps = 'onSelect' | 'disabled' | 'children'

export interface ICalendarRootProps
  extends Omit<PrimitiveDivProps, ConflictingProps>,
    UseCalendar.IUseCalendarConfig<Date, Selection.SelectionMode> {
  children?: React.ReactNode
}

const Calendar = React.forwardRef<CalendarElement, ICalendarRootProps>(
  (props: ScopedProps<ICalendarRootProps>, forwardedRef) => {
    const {
      __scopeCalendar,
      // IUseCalendarConfig props
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

    const contextValue = React.useMemo<CalendarContextValue>(() => {
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
