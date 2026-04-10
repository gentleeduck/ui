'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new NativeAdapter()

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
]

export default function Demo() {
  const [date, setDate] = React.useState<Date | null>(new Date())
  const [month, setMonth] = React.useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  return (
    <div className="w-fit rounded-md border shadow-sm">
      <Calendar
        className="mx-auto p-3"
        mode="single"
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        fixedWeeks
        showDropdowns={false}
      />
      <div className="grid grid-cols-3 gap-1.5 border-t p-3">
        {PRESETS.map((preset) => (
          <Button
            key={preset.days}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              const target = adapter.addDays(adapter.today(), preset.days)
              setDate(target)
              setMonth(new Date(target.getFullYear(), target.getMonth(), 1))
            }}>
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
