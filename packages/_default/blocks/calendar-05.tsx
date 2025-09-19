"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/registry/default/ui/calendar"

export default function Calendar05() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  })

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={dateRange?.from}
      mode="range"
      numberOfMonths={2}
      onSelect={setDateRange}
      selected={dateRange}
    />
  )
}
