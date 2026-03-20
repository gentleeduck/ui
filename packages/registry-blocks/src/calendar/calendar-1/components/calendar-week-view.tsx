'use client'

import { cn } from '@gentleduck/libs/cn'
import type { CalendarEvent } from '../calendar-data'
import { getDaysForWeek, getEventsForDay, isToday, isWeekend } from '../calendar-utils'
import { CalendarEventChip } from './calendar-event-chip'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarWeekViewProps {
  viewedDate: Date; events: CalendarEvent[]
  onDayClick: (dateStr: string) => void; onSelectEvent: (event: CalendarEvent) => void
}

export function CalendarWeekView({ viewedDate, events, onDayClick, onSelectEvent }: CalendarWeekViewProps) {
  const days = getDaysForWeek(viewedDate)

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-7 border-b bg-muted/40">
        {days.map((d, i) => (
          <div key={i} className="px-2 py-2 text-center text-xs">
            <span className="font-semibold text-muted-foreground">{WEEKDAYS[i]}</span>
            <span className={cn('ml-1.5 inline-flex size-6 items-center justify-center rounded-full text-xs',
              isToday(d) && 'bg-primary text-primary-foreground font-semibold')}>{d.getDate()}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const dayEvents = getEventsForDay(events, d)
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          return (
            <div key={i} className={cn('min-h-64 border-r p-2 last:border-r-0', isWeekend(d) && 'bg-muted/20')}
              onClick={() => onDayClick(dateStr)} role="gridcell" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDayClick(dateStr) } }}>
              <div className="flex flex-col gap-1">
                {dayEvents.map((evt) => <CalendarEventChip key={evt.id} event={evt} onSelect={onSelectEvent} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
