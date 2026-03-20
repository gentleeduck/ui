'use client'

import type { CalendarEvent } from '../calendar-data'
import { getEventsForDay, getWeeksForMonth } from '../calendar-utils'
import { CalendarDayCell } from './calendar-day-cell'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarGridProps {
  viewedMonth: Date
  events: CalendarEvent[]
  overflowDay: string | null
  onOverflowChange: (day: string | null) => void
  onDayClick: (dateStr: string) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

export function CalendarGrid({ viewedMonth, events, overflowDay, onOverflowChange, onDayClick, onEditEvent, onDeleteEvent }: CalendarGridProps) {
  const weeks = getWeeksForMonth(viewedMonth.getFullYear(), viewedMonth.getMonth())

  return (
    <div role="grid" className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div role="row" className="grid grid-cols-7 border-b bg-muted/50">
        {WEEKDAYS.map((d) => (
          <div key={d} role="columnheader" className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} role="row" className="grid grid-cols-7">
          {week.map((date, di) => (
            <CalendarDayCell
              key={di}
              date={date}
              viewedMonth={viewedMonth}
              events={getEventsForDay(events, date)}
              overflowDay={overflowDay}
              onOverflowChange={onOverflowChange}
              onDayClick={onDayClick}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
