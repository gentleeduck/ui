'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new NativeAdapter()

const BOOKED_DATES = [
  new Date(2026, 2, 19),
  new Date(2026, 2, 20),
  new Date(2026, 2, 21),
  new Date(2026, 2, 26),
  new Date(2026, 2, 27),
]

function isBooked(date: Date): boolean {
  return BOOKED_DATES.some((d) => adapter.isSameDay(d, date))
}

export default function Demo() {
  const [selected, setSelected] = React.useState<Date | null>(null)
  const today = new Date()

  return (
    <div className="space-y-4">
      <Calendar
        className="rounded-md border shadow-sm"
        mode="single"
        selected={selected}
        onSelect={setSelected}
        disabled={isBooked}
        fromDate={today}
        fixedWeeks
      />
      {selected ? (
        <div className="rounded-md border bg-muted/50 p-3 text-sm">
          <p className="font-medium">Booking confirmed</p>
          <p className="text-muted-foreground">
            {selected.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Select an available date to book</p>
      )}
    </div>
  )
}
