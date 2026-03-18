'use client'

import { buildCalendarYear, goToMonth, goToYear, NativeAdapter } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { buttonVariants } from '../button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from '../select'

const adapter = new NativeAdapter()

interface CalendarHeaderProps {
  month: Date
  title: string
  direction: 'ltr' | 'rtl'
  locale?: string
  buttonVariant: string
  showDropdowns: boolean
  yearRange: { from: number; to: number }
  getNavProps: (dir: 'prev' | 'next') => { 'aria-label': string; disabled: boolean; onClick: () => void }
  getHeaderProps: () => { id: string; 'aria-live': 'polite' }
  onMonthSelect: (date: Date) => void
}

/** Prevents Select portal interactions from dismissing parent Popover. */
function stopPopoverDismiss(e: React.PointerEvent) {
  e.stopPropagation()
}

export function CalendarHeader({
  month,
  title,
  direction,
  locale,
  buttonVariant,
  showDropdowns,
  yearRange,
  getNavProps,
  getHeaderProps,
  onMonthSelect,
}: CalendarHeaderProps) {
  const headerProps = getHeaderProps()
  const currentYear = adapter.getYear(month)
  const currentMonth = adapter.getMonth(month)

  const months = React.useMemo(() => buildCalendarYear(adapter, month, locale), [month, locale])

  const years = React.useMemo(() => {
    const result: number[] = []
    for (let y = yearRange.from; y <= yearRange.to; y++) {
      result.push(y)
    }
    return result
  }, [yearRange.from, yearRange.to])

  return (
    <div className="flex h-(--gentleduck-calendar-cell) w-full items-center justify-center px-(--gentleduck-calendar-cell)">
      <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
        <button
          type="button"
          {...getNavProps('prev')}
          className={cn(
            buttonVariants({ variant: buttonVariant as 'ghost' }),
            'size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
          )}>
          <ChevronLeftIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
        </button>

        {showDropdowns ? (
          <div className="flex items-center gap-1" onPointerDown={stopPopoverDismiss}>
            {/* Month dropdown */}
            <Select
              value={String(currentMonth)}
              onValueChange={(v) => onMonthSelect(goToMonth(adapter, month, Number(v)))}>
              <SelectTrigger
                className={cn(
                  'h-7 gap-1 border-none px-2 font-medium text-sm shadow-none focus:ring-0',
                  '[&>svg]:size-3 [&>svg]:text-muted-foreground',
                )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectScrollUpButton />
                {months.map((entry) => (
                  <SelectItem key={entry.month} value={String(entry.month)}>
                    {entry.label}
                  </SelectItem>
                ))}
                <SelectScrollDownButton />
              </SelectContent>
            </Select>

            {/* Year dropdown */}
            <Select
              value={String(currentYear)}
              onValueChange={(v) => onMonthSelect(goToYear(adapter, month, Number(v)))}>
              <SelectTrigger
                className={cn(
                  'h-7 gap-1 border-none px-2 font-medium text-sm shadow-none focus:ring-0',
                  '[&>svg]:size-3 [&>svg]:text-muted-foreground',
                )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="max-h-[min(var(--gentleduck-select-content-available-height,240px),240px)]"
                onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectScrollUpButton />
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
                <SelectScrollDownButton />
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div {...headerProps} className="select-none font-medium text-sm">
            {title}
          </div>
        )}

        <button
          type="button"
          {...getNavProps('next')}
          className={cn(
            buttonVariants({ variant: buttonVariant as 'ghost' }),
            'size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
          )}>
          <ChevronRightIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
        </button>
      </div>
    </div>
  )
}

CalendarHeader.displayName = 'CalendarHeader'
