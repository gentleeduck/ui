'use client'

import { cn } from '@gentleduck/libs/cn'
import { CATEGORY_COLORS, type CalendarEvent } from '../calendar-data'
import { formatDateString, getDaysForWeek, getEventsForDay, isToday, isWeekend } from '../calendar-utils'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 56 // px per hour

function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

interface CalendarWeekViewProps {
  viewedDate: Date
  events: CalendarEvent[]
  onDayClick: (dateStr: string) => void
  onSelectEvent: (event: CalendarEvent) => void
}

export function CalendarWeekView({ viewedDate, events, onDayClick, onSelectEvent }: CalendarWeekViewProps) {
  const days = getDaysForWeek(viewedDate)

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Header with day names and dates */}
      <div className="grid border-b bg-muted/40" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div /> {/* spacer for hour labels */}
        {days.map((d, i) => (
          <div key={i} className={cn('border-l px-2 py-2 text-center', isWeekend(d) && 'bg-muted/30')}>
            <span className="text-xs font-semibold text-muted-foreground">{WEEKDAYS[i]}</span>
            <span className={cn(
              'ml-1.5 inline-flex size-6 items-center justify-center rounded-full text-xs font-medium',
              isToday(d) && 'bg-primary text-primary-foreground font-bold',
            )}>{d.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Timeline body */}
      <div className="max-h-[700px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
          {/* Hour labels column */}
          <div>
            {HOURS.map((hour) => (
              <div key={hour} className="flex items-start justify-end border-b pr-2 text-xs text-muted-foreground" style={{ height: HOUR_HEIGHT }}>
                <span className="relative -top-2">{formatHour(hour)}</span>
              </div>
            ))}
          </div>

          {/* 7 day columns */}
          {days.map((d, di) => {
            const dayEvents = getEventsForDay(events, d)
            const dateStr = formatDateString(d)
            return (
              <div
                key={di}
                className={cn('relative border-l', isWeekend(d) && 'bg-muted/10')}
                onClick={() => onDayClick(dateStr)}
                role="gridcell"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDayClick(dateStr) } }}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div key={hour} className="border-b" style={{ height: HOUR_HEIGHT }} />
                ))}
                {/* Positioned events */}
                {dayEvents.map((evt) => {
                  const colors = CATEGORY_COLORS[evt.category]
                  const top = (evt.timeValue / 60) * HOUR_HEIGHT
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      className={cn(
                        'absolute inset-x-0.5 z-10 rounded border-l-2 px-1 py-0.5 text-left text-[10px] leading-tight transition-opacity hover:opacity-80',
                        colors.bg, colors.text,
                      )}
                      style={{ top, minHeight: HOUR_HEIGHT * 0.6, borderLeftColor: 'currentColor' }}
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(evt) }}
                    >
                      <p className="truncate font-medium">{evt.title}</p>
                      <p className="opacity-70">{evt.time}</p>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
