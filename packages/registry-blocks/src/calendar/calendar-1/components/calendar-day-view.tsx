'use client'

import { cn } from '@gentleduck/libs/cn'
import { CATEGORY_COLORS, type CalendarEvent } from '../calendar-data'
import { formatDateString, getEventsForDay } from '../calendar-utils'

interface CalendarDayViewProps {
  viewedDate: Date
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 60 // px per hour

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
      <div className="max-h-[700px] overflow-y-auto">
        <div className="relative flex">
          {/* Hour labels */}
          <div className="shrink-0">
            {HOURS.map((hour) => (
              <div key={hour} className="flex items-start justify-end border-b pr-2 text-xs text-muted-foreground" style={{ height: HOUR_HEIGHT }}>
                <span className="relative -top-2">{formatHour(hour)}</span>
              </div>
            ))}
          </div>
          {/* Timeline column */}
          <div className="relative flex-1 border-l">
            {/* Grid lines */}
            {HOURS.map((hour) => (
              <div key={hour} className="border-b" style={{ height: HOUR_HEIGHT }} />
            ))}
            {/* Events positioned absolutely */}
            {dayEvents.map((evt) => {
              const colors = CATEGORY_COLORS[evt.category]
              const top = (evt.timeValue / 60) * HOUR_HEIGHT
              return (
                <button
                  key={evt.id}
                  type="button"
                  className={cn(
                    'absolute left-1 right-4 rounded-md border-l-3 px-2 py-1 text-left text-xs transition-opacity hover:opacity-80',
                    colors.bg, colors.text,
                  )}
                  style={{ top, minHeight: HOUR_HEIGHT * 0.75, borderLeftColor: 'currentColor' }}
                  onClick={() => onSelectEvent(evt)}
                >
                  <p className="font-medium truncate">{evt.title}</p>
                  <p className="text-[10px] opacity-70">{evt.time}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
