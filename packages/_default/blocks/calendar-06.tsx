'use client'

import * as React from 'react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/registry/default/ui/calendar'

export default function Calendar06() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 26),
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Calendar
        className="rounded-lg border shadow-sm"
        defaultMonth={dateRange?.from}
        min={5}
        mode="range"
        numberOfMonths={1}
        onSelect={setDateRange}
        selected={dateRange}
      />
      <div className="text-muted-foreground text-center text-xs">A minimum of 5 days is required</div>
    </div>
  )
}
