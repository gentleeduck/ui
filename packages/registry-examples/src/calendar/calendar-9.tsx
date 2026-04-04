'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(new Date())

  return (
    <Calendar
      className="rounded-md border shadow-sm"
      dir="rtl"
      locale="ar-SA"
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
