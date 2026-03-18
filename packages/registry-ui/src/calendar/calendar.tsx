'use client'

import { type CalendarValue, NativeAdapter, type SelectionMode, useCalendar } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { buttonVariants } from '../button'

const adapter = new NativeAdapter()

export interface CalendarProps {
  className?: string
  /** Selection mode. Default `'single'`. */
  mode?: SelectionMode
  /** Controlled selection value. */
  selected?: CalendarValue<Date, SelectionMode>
  /** Called when the selection changes. */
  onSelect?: (value: CalendarValue<Date, SelectionMode>) => void
  /** Dates that cannot be selected. */
  disabled?: Date[] | ((date: Date) => boolean)
  /** Default month to display (uncontrolled). */
  defaultMonth?: Date
  /** Controlled month. */
  month?: Date
  /** Called when the displayed month changes. */
  onMonthChange?: (month: Date) => void
  /** Show days from adjacent months. Default `true`. */
  showOutsideDays?: boolean
  /** Always show 6 weeks. Default `false`. */
  fixedWeeks?: boolean
  /** How many months to show side by side. Default `1`. */
  numberOfMonths?: number
  /** BCP 47 locale tag (e.g. `'ar-SA'`). */
  locale?: string
  /** Text direction. */
  dir?: Direction
  /** Earliest selectable date. */
  fromDate?: Date
  /** Latest selectable date. */
  toDate?: Date
  /** Called when the user presses Escape. */
  onDismiss?: () => void
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
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
    },
    ref,
  ) => {
    const direction = useDirection(dir)

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
    const headerProps = getHeaderProps()
    const gridProps = getGridProps()

    const title = adapter.format(state.month, { month: 'long', year: 'numeric' }, locale)

    return (
      <div
        ref={ref}
        data-slot="calendar"
        dir={direction}
        className={cn(
          'group/calendar bg-background p-3 [--cell-size:--spacing(8)]',
          'in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
          className,
        )}>
        <div className="relative flex flex-col gap-4 md:flex-row">
          {state.months.map((monthGrid, monthIdx) => {
            const monthTitle = adapter.format(monthGrid.month, { month: 'long', year: 'numeric' }, locale)

            return (
              <div key={monthGrid.month.getTime()} className="flex w-full flex-col gap-4">
                {/* Caption + Nav */}
                <div className="flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)">
                  {monthIdx === 0 && (
                    <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
                      <button
                        type="button"
                        {...getNavProps('prev')}
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
                        )}>
                        <ChevronLeftIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
                      </button>
                      <div {...headerProps} className="select-none font-medium text-sm">
                        {numberOfMonths <= 1 ? title : ''}
                      </div>
                      <button
                        type="button"
                        {...getNavProps('next')}
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
                        )}>
                        <ChevronRightIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
                      </button>
                    </div>
                  )}
                  {numberOfMonths > 1 && <span className="select-none font-medium text-sm">{monthTitle}</span>}
                </div>

                {/* Grid */}
                <div {...gridProps}>
                  {/* Weekday headers */}
                  <div className="flex">
                    {state.weekdays.map((day) => (
                      <div
                        key={day}
                        className="flex-1 select-none rounded-md text-center font-normal text-[0.8rem] text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Weeks */}
                  {monthGrid.weeks.map((week) => (
                    // biome-ignore lint/a11y/useSemanticElements: role="row" on div is intentional per WAI-ARIA grid pattern
                    // biome-ignore lint/a11y/useFocusableInteractive: grid rows are not interactive
                    <div key={week.weekNumber} role="row" className="mt-2 flex w-full">
                      {week.days.map((day) => {
                        const dayProps = getDayProps(day)
                        const isSelectedSingle =
                          day.isSelected && !day.isRangeStart && !day.isRangeEnd && !day.isRangeMiddle

                        return (
                          <div
                            key={day.date.getTime()}
                            data-selected={day.isSelected ? 'true' : undefined}
                            className={cn(
                              'group/day relative aspect-square h-full w-full select-none p-0 text-center',
                              '[&:first-child[data-selected=true]_button]:rounded-s-md',
                              '[&:last-child[data-selected=true]_button]:rounded-e-md',
                            )}>
                            <button
                              type="button"
                              {...dayProps}
                              className={cn(
                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none',
                                // Selection states
                                isSelectedSingle && 'bg-primary text-primary-foreground',
                                day.isRangeStart && 'rounded-md rounded-s-md bg-primary text-primary-foreground',
                                day.isRangeEnd && 'rounded-md rounded-e-md bg-primary text-primary-foreground',
                                day.isRangeMiddle && 'rounded-none bg-accent text-accent-foreground',
                                // Today
                                day.isToday && !day.isSelected && 'rounded-md bg-accent text-accent-foreground',
                                day.isToday && day.isSelected && 'rounded-none',
                                // Outside month
                                day.isOutside && 'text-muted-foreground',
                                day.isOutside && day.isSelected && 'text-muted-foreground',
                                // Disabled
                                day.isDisabled && 'text-muted-foreground opacity-50',
                                // Focus
                                day.date.getTime() === state.focusedDate.getTime() &&
                                  'relative z-10 border-ring ring-[3px] ring-ring/50',
                              )}>
                              {day.date.getDate()}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <announcer.AnnouncerPortal />
      </div>
    )
  },
)
Calendar.displayName = 'Calendar'

export { Calendar }
