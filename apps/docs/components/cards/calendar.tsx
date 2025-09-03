'use client'

import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Card, CardContent } from '@gentleduck/registry-ui-duckui/card'
import { addDays } from 'date-fns'

const start = new Date(2023, 5, 5)

export function CardsCalendar() {
  return (
    <Card className="max-w-[260px] py-0 h-fit">
      <CardContent className="p-1">
        <Calendar
          numberOfMonths={1}
          mode="range"
          defaultMonth={start}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
        />
      </CardContent>
    </Card>
  )
}
