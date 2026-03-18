'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const today = new Date()
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())

  return (
    <Calendar
      className="rounded-md border shadow-sm"
      mode="single"
      selected={date}
      onSelect={setDate}
      fromDate={today}
      toDate={maxDate}
    />
  )
}
