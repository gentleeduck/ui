'use client'

import { NativeAdapter, useCalendar } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/direction'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { buttonVariants } from '../button'
import type { CalendarProps } from './calendar.types'
import { CalendarDayCell } from './calendar-day'
import { CalendarHeader } from './calendar-header'

const adapter = new NativeAdapter()

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      buttonVariant = 'ghost',
      mode = 'single',
      selected,
      onSelect,
      disabled,
      defaultMonth,
      month: controlledMonth,
      onMonthChange,
      showOutsideDays = true,
      fixedWeeks = false,
      numberOfMonths = 1,
      locale,
      dir,
      fromDate,
      toDate,
      onDismiss,
      showDropdowns = true,
      yearRange,
    },
    ref,
  ) => {
    const direction = useDirection(dir)
    const currentYear = new Date().getFullYear()
    const resolvedYearRange = yearRange ?? { from: currentYear - 100, to: currentYear + 10 }

    const calendar = useCalendar({
      adapter,
      mode,
      locale: locale ? { locale, weekStartDay: 0, direction } : { weekStartDay: 0, direction },
      month: controlledMonth,
      defaultMonth,
      selected,
      onSelect,
      onMonthChange,
      showOutsideDays,
      fixedWeeks,
      numberOfMonths,
      disabled,
      fromDate,
      toDate,
      onDismiss,
    })

    const { state, getDayProps, getGridProps, getNavProps, getHeaderProps, announcer } = calendar

    return (
      <div
        ref={ref}
        data-slot="calendar"
        dir={direction}
        className={cn(
          'group/calendar w-fit bg-background p-3 [--gentleduck-calendar-cell:--spacing(8)]',
          'in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
          className,
        )}>
        <div className="relative flex flex-col gap-4">
          {/* Nav header — spans full width above all months */}
          {numberOfMonths <= 1 ? (
            <CalendarHeader
              month={state.month}
              title={adapter.format(state.month, { month: 'long', year: 'numeric' }, locale)}
              direction={direction}
              locale={locale}
              buttonVariant={buttonVariant}
              showDropdowns={showDropdowns}
              yearRange={resolvedYearRange}
              getNavProps={getNavProps}
              getHeaderProps={getHeaderProps}
              onMonthSelect={calendar.actions.setMonth}
            />
          ) : (
            <div className="relative flex w-full items-center">
              <button
                type="button"
                {...getNavProps('prev')}
                className={cn(
                  buttonVariants({ variant: buttonVariant as 'ghost' }),
                  'absolute start-0 z-10 size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
                )}>
                <ChevronLeftIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
              </button>
              {state.months.map((m) => (
                <span key={m.month.getTime()} className="flex-1 select-none text-center font-medium text-sm">
                  {adapter.format(m.month, { month: 'long', year: 'numeric' }, locale)}
                </span>
              ))}
              <button
                type="button"
                {...getNavProps('next')}
                className={cn(
                  buttonVariants({ variant: buttonVariant as 'ghost' }),
                  'absolute end-0 z-10 size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
                )}>
                <ChevronRightIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row">
            {state.months.map((monthGrid) => {
              const gridProps = getGridProps()
              return (
                <div key={monthGrid.month.getTime()} className="flex w-full flex-col gap-4">
                  <div {...gridProps}>
                    {/* biome-ignore lint/a11y/useSemanticElements: role="row" on div per WAI-ARIA grid pattern */}
                    {/* biome-ignore lint/a11y/useFocusableInteractive: weekday header row is not interactive */}
                    <div role="row" className="flex">
                      {state.weekdays.map((day) => (
                        // biome-ignore lint/a11y/useSemanticElements: columnheader on div per WAI-ARIA grid pattern
                        // biome-ignore lint/a11y/useFocusableInteractive: weekday headers are not interactive
                        <div
                          key={day}
                          role="columnheader"
                          className="flex-1 select-none rounded-md text-center font-normal text-[0.8rem] text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>
                    {monthGrid.weeks.map((week) => (
                      // biome-ignore lint/a11y/useSemanticElements: role="row" on div per WAI-ARIA grid pattern
                      // biome-ignore lint/a11y/useFocusableInteractive: grid rows are not interactive
                      <div key={week.weekNumber} role="row" className="mt-2 flex w-full">
                        {week.days.map((day, dayIdx) => {
                          const {
                            onMouseEnter: _,
                            role: _role,
                            'aria-selected': _ariaSel,
                            ...dayProps
                          } = getDayProps(day)
                          const isSelectedSingle =
                            day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isRangeMiddle
                          const isFocused = day.date.getTime() === state.focusedDate.getTime()
                          return (
                            <CalendarDayCell
                              key={day.date.getTime()}
                              day={day}
                              dayProps={dayProps}
                              isFocused={isFocused}
                              isSelectedSingle={isSelectedSingle}
                              isFirstInRow={dayIdx === 0}
                              isLastInRow={dayIdx === 6}
                              onFocusDate={calendar.actions.focusDate}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <announcer.AnnouncerPortal />
      </div>
    )
  },
)
Calendar.displayName = 'Calendar'

export { Calendar }
