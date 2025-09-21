'use client'

import * as React from 'react'

import { Calendar } from '@/registry/default/ui/calendar'

export default function Calendar03() {
  const [dates, setDates] = React.useState<Date[]>([new Date(2025, 5, 12), new Date(2025, 6, 24)])

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={dates[0]}
      max={5}
      mode="multiple"
      numberOfMonths={2}
      onSelect={setDates}
      required
      selected={dates}
    />
  )
}
