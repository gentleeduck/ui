'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(new Date())
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
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
