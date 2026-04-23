'use client'

import * as React from 'react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/registry/default/ui/calendar'

export default function Calendar07() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 18),
    to: new Date(2025, 6, 7),
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Calendar
        className="rounded-lg border shadow-sm"
        defaultMonth={dateRange?.from}
        max={20}
        min={2}
        mode="range"
        numberOfMonths={2}
        onSelect={setDateRange}
        selected={dateRange}
      />
      <div className="text-muted-foreground text-center text-xs">Your stay must be between 2 and 20 nights</div>
    </div>
  )
}
