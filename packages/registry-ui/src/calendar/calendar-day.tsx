'use client'

import type { CalendarDay as CalendarDayType, DayProps } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'
import { buttonVariants } from '../button'

interface CalendarDayCellProps {
  day: CalendarDayType<Date>
  dayProps: Omit<DayProps, 'role' | 'aria-selected' | 'onMouseEnter'>
  isFocused: boolean
  isSelectedSingle: boolean
  isFirstInRow: boolean
  isLastInRow: boolean
  locale?: string
  onFocusDate: (date: Date) => void
  renderDay?: (day: CalendarDayType<Date>, children: React.ReactNode) => React.ReactNode
}

export function CalendarDayCell({
  day,
  dayProps,
  isFocused,
  isSelectedSingle,
  isFirstInRow,
  isLastInRow,
  locale,
  onFocusDate,
  renderDay,
}: CalendarDayCellProps) {
  const isInRange = day.isRangeStart || day.isRangeEnd || day.isRangeMiddle
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
        isInRange && 'overflow-hidden',
        day.isRangeStart && 'rounded-s-md bg-accent',
        day.isRangeEnd && 'rounded-e-md bg-accent',
        day.isRangeMiddle && 'bg-accent',
        isInRange && isFirstInRow && !day.isRangeStart && 'rounded-s-md',
        isInRange && isLastInRow && !day.isRangeEnd && 'rounded-e-md',
        day.isOutside && 'text-muted-foreground',
        day.isOutside && day.isSelected && 'text-muted-foreground',
        day.isDisabled && 'pointer-events-none text-muted-foreground opacity-50',
      )}>
      <button
        type="button"
        {...dayProps}
        disabled={day.isDisabled}
        tabIndex={day.isDisabled ? -1 : dayProps.tabIndex}
        onClick={() => {
          if (day.isDisabled) return
          dayProps.onClick()
          onFocusDate(day.date)
        }}
        data-day={day.date.toLocaleDateString()}
        data-range-end={day.isRangeEnd || undefined}
        data-range-middle={day.isRangeMiddle || undefined}
        data-range-start={day.isRangeStart || undefined}
        data-selected-single={isSelectedSingle || undefined}
        data-today={day.isToday || undefined}
        data-focused={isFocused || undefined}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'flex aspect-square size-auto w-full min-w-(--gentleduck-calendar-cell) flex-col gap-1 font-normal leading-none focus-visible:ring-0 focus-visible:ring-offset-0',
          // Single selection
          'data-[selected-single=true]:rounded-md data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground',
          // Range selection
          'data-[range-start=true]:rounded-s-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground',
          'data-[range-end=true]:rounded-e-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground',
          'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground',
          // Outside month — muted appearance
          day.isOutside && 'text-muted-foreground/50',
          // Today — just bold text, no background
          'data-[today=true]:font-semibold',
          // Focus ring
          'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:rounded-md group-data-[focused=true]/day:border group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-1 group-data-[focused=true]/day:ring-ring/50',
          '[&>span]:text-xs [&>span]:opacity-70',
        )}>
        {(() => {
          const localeTag = locale?.startsWith('ar') ? `${locale}-u-nu-arab` : locale
          const dayNum = localeTag ? new Intl.NumberFormat(localeTag).format(day.date.getDate()) : day.date.getDate()
          return renderDay ? renderDay(day, dayNum) : dayNum
        })()}
      </button>
    </div>
  )
}

CalendarDayCell.displayName = 'CalendarDayCell'
