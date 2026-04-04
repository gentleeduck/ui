'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new NativeAdapter()

const BOOKED_DATES = [
  new Date(2026, 2, 3),
  new Date(2026, 2, 4),
  new Date(2026, 2, 10),
  new Date(2026, 2, 11),
  new Date(2026, 2, 17),
  new Date(2026, 2, 24),
  new Date(2026, 2, 25),
]

function isBooked(date: Date) {
  return BOOKED_DATES.some((d) => adapter.isSameDay(d, date))
}

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(null)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return (
    <Calendar
      className="rounded-md border shadow-sm"
      mode="single"
      defaultMonth={new Date(2026, 2, 1)}
      selected={date}
      onSelect={setDate}
      disabled={(d) => isBooked(d)}
      fromDate={today}
      showDropdowns={false}
      renderDay={(day, children) => {
        if (day.isDisabled && isBooked(day.date)) {
          return <span className="text-muted-foreground/40 line-through">{children}</span>
        }
        return children
      }}
      renderFooter={() => (
        <div className="flex items-center gap-4 px-0 pt-2 text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="line-through">Booked</span>
          </div>
        </div>
      )}
    />
  )
}
