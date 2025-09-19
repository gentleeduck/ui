"use client"

import * as React from "react"

import { Calendar } from "@/registry/default/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      className="rounded-md border shadow"
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
