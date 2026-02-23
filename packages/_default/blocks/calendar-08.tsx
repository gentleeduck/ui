'use client'

import * as React from 'react'

import { Calendar } from '@/registry/default/ui/calendar'

export default function Calendar08() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))

  return (
    <Calendar
      className="rounded-lg border shadow-sm"
      defaultMonth={date}
      disabled={{
        before: new Date(2025, 5, 12),
      }}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
