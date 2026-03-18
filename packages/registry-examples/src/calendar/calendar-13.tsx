'use client'

import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

interface DateRange {
  from: Date
  to: Date | null
}

export default function CalendarDemo() {
  const [ranges, setRanges] = React.useState<DateRange[]>([])
  const [current, setCurrent] = React.useState<DateRange | undefined>()

  return (
    <div className="space-y-4">
      <Calendar
        className="rounded-md border shadow-sm"
        mode="range"
        selected={current}
        onSelect={(range) => {
          setCurrent(range as DateRange | undefined)
          // When a complete range is selected (both from and to), save it and reset
          if (range && (range as DateRange).to) {
            setRanges((prev) => [...prev, range as DateRange])
            setCurrent(undefined)
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
              {r.from.toLocaleDateString()} — {r.to?.toLocaleDateString()}
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
