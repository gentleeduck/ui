'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
]

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [month, setMonth] = React.useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  return (
    <div className="w-fit rounded-md border shadow-sm">
      <Calendar
        className="p-3"
        mode="single"
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        fixedWeeks
        showDropdowns={false}
      />
      <div className="flex flex-wrap gap-1.5 border-t p-3">
        {PRESETS.map((preset) => (
          <Button
            key={preset.days}
            variant="outline"
            size="sm"
            className="w-fit text-xs"
            onClick={() => {
              const target = addDays(new Date(), preset.days)
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
