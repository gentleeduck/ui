'use client'

import { Separator } from '@gentleduck/registry-ui/separator'
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

export function CalendarGrid({
  viewedMonth,
  events,
  overflowDay,
  onOverflowChange,
  onDayClick,
  onEditEvent,
  onDeleteEvent,
}: CalendarGridProps) {
  const weeks = getWeeksForMonth(viewedMonth.getFullYear(), viewedMonth.getMonth())

  return (
    <div role="grid" className="rounded-b-xl border-border bg-card">
      {/* biome-ignore lint/a11y/useFocusableInteractive: ARIA grid pattern - rows are not individually focusable */}
      <div role="row" className="grid grid-cols-7 border-border">
        {WEEKDAYS.map((d) => (
          // biome-ignore lint/a11y/useFocusableInteractive: ARIA grid pattern - columnheader is not individually focusable
          <div
            key={d}
            role="columnheader"
            className="border-border border-r px-2 py-2.5 text-center font-semibold text-muted-foreground text-xs uppercase tracking-wide last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      <Separator />
      {weeks.map((week, wi) => (
        // biome-ignore lint/a11y/useFocusableInteractive: ARIA grid pattern - rows are not individually focusable
        <div key={wi} role="row" className="grid grid-cols-7 border-border border-b last:border-b-0">
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
