'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import { arSA } from 'date-fns/locale'
import * as React from 'react'

export default function CalendarRtlDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      captionLayout="dropdown"
      className="rounded-md border shadow-sm"
      dir="rtl"
      locale={arSA}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  )
}
