'use client'

import type { DateRange } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function CalendarDemo() {
  const [ranges, setRanges] = React.useState<DateRange<Date>[]>([])
  const [current, setCurrent] = React.useState<DateRange<Date> | null>(null)

  return (
    <div className="space-y-4">
      <Calendar
        className="rounded-md border shadow-sm"
        mode="range"
        selected={current}
        onSelect={(range) => {
          const r = range as DateRange<Date> | null
          setCurrent(r)
          if (r?.to) {
            setRanges((prev) => [...prev, r])
            setCurrent(null)
          }
        }}
        showDropdowns={false}
      />
      <div className="space-y-1 px-1">
        <p className="font-medium text-sm">
          {ranges.length} range{ranges.length !== 1 ? 's' : ''} selected
        </p>
        {ranges.map((r, i) => (
          <div key={r.from.getTime()} className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>
              {r.from.toLocaleDateString()} - {r.to?.toLocaleDateString()}
            </span>
            <button
              type="button"
              className="text-destructive text-xs hover:underline"
              onClick={() => setRanges((prev) => prev.filter((_, j) => j !== i))}>
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
