'use client'

import type { DateRange } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

export default function Demo() {
  const [ranges, setRanges] = React.useState<DateRange<Date>[]>([])

  return (
    <div className="space-y-4">
      <Calendar
        className="rounded-md border shadow-sm"
        mode="multi-range"
        selected={ranges}
        onSelect={(value) => {
          setRanges(value as DateRange<Date>[])
        }}
        showDropdowns={false}
      />
      <div className="space-y-1 px-1">
        <p className="font-medium text-sm">
          {ranges.filter((r) => r.to !== null).length} range
          {ranges.filter((r) => r.to !== null).length !== 1 ? 's' : ''} selected
        </p>
        {ranges
          .filter((r) => r.to !== null)
          .map((r, i) => (
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
