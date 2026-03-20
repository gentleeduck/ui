'use client'

import { cn } from '@gentleduck/libs/cn'
import type { CalendarEvent } from '../calendar-data'
import { getEventsForDay } from '../calendar-utils'
import { CalendarEventChip } from './calendar-event-chip'

interface CalendarDayViewProps {
  viewedDate: Date; events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

export function CalendarDayView({ viewedDate, events, onSelectEvent }: CalendarDayViewProps) {
  const dayEvents = getEventsForDay(events, viewedDate)

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="border-b bg-muted/40 px-4 py-2 text-center text-sm font-semibold">
        {viewedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = dayEvents.filter((e) => Math.floor(e.timeValue / 60) === hour)
          return (
            <div key={hour} className="flex min-h-12 border-b last:border-b-0">
              <div className="flex w-16 shrink-0 items-start justify-end border-r px-2 pt-1 text-xs text-muted-foreground">
                {formatHour(hour)}
              </div>
              <div className="flex flex-1 flex-col gap-0.5 p-1">
                {hourEvents.map((evt) => <CalendarEventChip key={evt.id} event={evt} onSelect={onSelectEvent} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
