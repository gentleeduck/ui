'use client'

import type { Selection } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const today = new Date()
  const initialFrom = new Date(today.getFullYear(), 0, 12)
  const initialTo = new Date(today.getFullYear(), 1, 11)

  const [dateRange, setDateRange] = React.useState<Selection.DateRange<Date> | null>({
    from: initialFrom,
    to: initialTo,
  })

  return (
    <Calendar
      className="rounded-md border shadow-sm"
      mode="range"
      defaultMonth={dateRange?.from}
      numberOfMonths={2}
      selected={dateRange}
      onSelect={setDateRange}
      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
      showDropdowns={false}
    />
  )
}
