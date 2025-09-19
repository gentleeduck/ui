'use client'

import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import * as React from 'react'

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      captionLayout="dropdown"
      className="rounded-md border shadow-sm"
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
