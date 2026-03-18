'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={date}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
