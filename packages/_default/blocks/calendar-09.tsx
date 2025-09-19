"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/registry/default/ui/calendar"

export default function Calendar09() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 17),
    to: new Date(2025, 5, 20),
  })

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={dateRange?.from}
      disabled={{ dayOfWeek: [0, 6] }}
      excludeDisabled
      mode="range"
      numberOfMonths={2}
      onSelect={setDateRange}
      selected={dateRange}
    />
  )
}
