'use client'

import type { CalendarDay as CalendarDayType, DayProps } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '../button'

interface CalendarDayCellProps {
  day: CalendarDayType<Date>
  dayProps: Omit<DayProps, 'role' | 'aria-selected' | 'onMouseEnter'>
  isFocused: boolean
  isSelectedSingle: boolean
  onFocusDate: (date: Date) => void
}

export function CalendarDayCell({ day, dayProps, isFocused, isSelectedSingle, onFocusDate }: CalendarDayCellProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: gridcell on div per WAI-ARIA grid pattern
    // biome-ignore lint/a11y/useFocusableInteractive: gridcell focus is on the child button
    <div
      role="gridcell"
      aria-selected={day.isSelected}
      data-selected={day.isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      className={cn(
        'group/day relative aspect-square h-full w-full select-none p-0 text-center',
        '[&:first-child[data-selected=true]_button]:rounded-s-md',
        '[&:last-child[data-selected=true]_button]:rounded-e-md',
        day.isRangeStart && 'rounded-s-md bg-accent',
        day.isRangeEnd && 'rounded-e-md bg-accent',
        day.isRangeMiddle && 'rounded-none bg-accent',
        day.isToday && 'rounded-md bg-accent text-accent-foreground',
        day.isToday && day.isSelected && 'rounded-none',
        day.isOutside && 'text-muted-foreground',
        day.isOutside && day.isSelected && 'text-muted-foreground',
        day.isDisabled && 'text-muted-foreground opacity-50',
      )}>
      <button
        type="button"
        {...dayProps}
        onClick={() => {
          dayProps.onClick()
          onFocusDate(day.date)
        }}
        data-day={day.date.toLocaleDateString()}
        data-range-end={day.isRangeEnd || undefined}
        data-range-middle={day.isRangeMiddle || undefined}
        data-range-start={day.isRangeStart || undefined}
        data-selected-single={isSelectedSingle || undefined}
        data-focused={isFocused || undefined}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'flex aspect-square size-auto w-full min-w-(--gentleduck-calendar-cell) flex-col gap-1 font-normal leading-none focus-visible:ring-0 focus-visible:ring-offset-0',
          'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground',
          'data-[range-start=true]:rounded-md data-[range-start=true]:rounded-s-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground',
          'data-[range-end=true]:rounded-md data-[range-end=true]:rounded-e-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground',
          'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground',
          'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-ring/50',
          '[&>span]:text-xs [&>span]:opacity-70',
        )}>
        {day.date.getDate()}
      </button>
    </div>
  )
}

CalendarDayCell.displayName = 'CalendarDayCell'
