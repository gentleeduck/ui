'use client'

import { IslamicAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new IslamicAdapter()

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(new Date())

  return (
    <Calendar
      adapter={adapter}
      className="rounded-md border shadow-sm"
      dir="rtl"
      locale="ar-SA"
      mode="single"
      onSelect={setDate}
      selected={date}
      showDropdowns
      yearRange={{ from: 1400, to: 1500 }}
    />
  )
}
