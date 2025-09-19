"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"

export default function Calendar02() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={date}
      mode="single"
      numberOfMonths={2}
      onSelect={setDate}
      selected={date}
    />
  )
}
