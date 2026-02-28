'use client'

import * as React from 'react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/registry/default/ui/calendar'

export default function Calendar11() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 17),
    to: new Date(2025, 5, 20),
  })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Calendar
        className="rounded-lg border shadow-sm"
        disableNavigation
        endMonth={new Date(2025, 6, 31)}
        mode="range"
        numberOfMonths={2}
        onSelect={setDateRange}
        selected={dateRange}
        startMonth={new Date(2025, 5, 1)}
      />
      <div className="text-muted-foreground text-center text-xs">We are open in June and July only.</div>
    </div>
  )
}
