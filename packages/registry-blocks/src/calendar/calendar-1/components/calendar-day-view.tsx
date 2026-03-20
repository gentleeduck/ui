'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { CATEGORY_COLORS, type CalendarEvent } from '../calendar-data'
import { getEventsForDay } from '../calendar-utils'
import { CalendarEventDetail } from './calendar-event-detail'

interface CalendarDayViewProps {
  viewedDate: Date
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 60

function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

function EventBlock({ event, onEdit, onDelete }: {
  event: CalendarEvent; onEdit: (e: CalendarEvent) => void; onDelete: (id: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const colors = CATEGORY_COLORS[event.category]
  const top = (event.timeValue / 60) * HOUR_HEIGHT

  return (
    <CalendarEventDetail event={event} open={open} onOpenChange={setOpen} onEdit={onEdit} onDelete={onDelete}>
      <button
        type="button"
        className={cn(
          'absolute left-1 right-4 z-10 rounded-lg px-3 py-1.5 text-left text-xs shadow-sm transition-shadow hover:shadow-md',
          colors.bg, colors.text,
        )}
        style={{ top, minHeight: HOUR_HEIGHT * 0.7 }}
        onClick={() => setOpen(true)}
      >
        <p className="font-semibold truncate">{event.title}</p>
        <p className="opacity-60 text-[10px]">{event.time}</p>
      </button>
    </CalendarEventDetail>
  )
}

export function CalendarDayView({ viewedDate, events, onSelectEvent, onEditEvent, onDeleteEvent }: CalendarDayViewProps) {
  const dayEvents = getEventsForDay(events, viewedDate)

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="border-b bg-muted/50 px-4 py-2.5 text-center text-sm font-semibold">
        {viewedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="max-h-[700px] overflow-y-auto">
        <div className="relative flex">
          {/* Hour labels */}
          <div className="w-16 shrink-0">
            {HOURS.map((hour) => (
              <div key={hour} className="relative border-b border-border/50" style={{ height: HOUR_HEIGHT }}>
                <span className="absolute -top-3 right-2 text-[11px] text-muted-foreground">{hour > 0 ? formatHour(hour) : ''}</span>
              </div>
            ))}
          </div>
          {/* Timeline */}
          <div className="relative flex-1 border-l">
            {HOURS.map((hour) => (
              <div key={hour} className="border-b border-border/50" style={{ height: HOUR_HEIGHT }} />
            ))}
            {dayEvents.map((evt) => (
              <EventBlock key={evt.id} event={evt} onEdit={onEditEvent} onDelete={onDeleteEvent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
