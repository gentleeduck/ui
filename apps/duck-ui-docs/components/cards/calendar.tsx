'use client'

import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Card, CardContent } from '@gentleduck/registry-ui-duckui/card'
import { addDays } from 'date-fns'

const start = new Date(2023, 5, 5)

export function CardsCalendar() {
  return (
    <Card className="h-fit max-w-[260px] py-0">
      <CardContent className="p-1">
        <Calendar
          defaultMonth={start}
          mode="range"
          numberOfMonths={1}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
        />
      </CardContent>
    </Card>
  )
}
