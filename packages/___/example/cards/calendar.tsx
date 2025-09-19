'use client'

import { addDays } from 'date-fns'
import { Calendar, Card, CardContent } from '@/registry/default/ui/'

const start = new Date(2023, 5, 5)

export function CardsCalendar() {
  return (
    <Card className="max-w-[280px]">
      <CardContent className="p-0">
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
