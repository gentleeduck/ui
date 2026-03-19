'use client'

import { PersianAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new PersianAdapter('en-US')

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      adapter={adapter}
      className="rounded-md border shadow-sm"
      locale="en-US"
      mode="single"
      onSelect={setDate as (value: unknown) => void}
      selected={date}
      showDropdowns
      yearRange={{ from: 1380, to: 1430 }}
    />
  )
}
