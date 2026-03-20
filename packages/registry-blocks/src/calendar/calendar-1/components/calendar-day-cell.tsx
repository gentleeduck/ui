'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'
import type { CalendarEvent } from '../calendar-data'
import { formatDateString, isToday, isSameMonth, isWeekend } from '../calendar-utils'
import { CalendarEventChip } from './calendar-event-chip'
import { CalendarEventDetail } from './calendar-event-detail'
import { CalendarOverflow } from './calendar-overflow'

const MAX_VISIBLE = 3

interface CalendarDayCellProps {
  date: Date
  viewedMonth: Date
  events: CalendarEvent[]
  overflowDay: string | null
  onOverflowChange: (day: string | null) => void
  onDayClick: (dateStr: string) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

function EventChipWithPopover({ event, onEdit, onDelete }: {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <CalendarEventDetail event={event} open={open} onOpenChange={setOpen} onEdit={onEdit} onDelete={onDelete}>
      <div><CalendarEventChip event={event} onSelect={() => setOpen(true)} /></div>
    </CalendarEventDetail>
  )
}

export function CalendarDayCell({
  date, viewedMonth, events, overflowDay, onOverflowChange,
  onDayClick, onEditEvent, onDeleteEvent,
}: CalendarDayCellProps) {
  const inMonth = isSameMonth(date, viewedMonth)
  const today = isToday(date)
  const wkend = isWeekend(date)
  const dateStr = formatDateString(date)
  const visible = events.slice(0, MAX_VISIBLE)
  const hidden = events.length - MAX_VISIBLE

  return (
    <div
      role="gridcell"
      tabIndex={inMonth ? 0 : -1}
      aria-disabled={!inMonth}
      className={cn(
        'flex min-h-28 flex-col border-b border-r p-1.5 transition-colors',
        wkend && inMonth && 'bg-muted/30',
        !inMonth && 'pointer-events-none select-none opacity-20',
        inMonth && 'cursor-pointer hover:bg-accent/40',
      )}
      onClick={() => { if (inMonth) onDayClick(dateStr) }}
      onKeyDown={(e) => { if (inMonth && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onDayClick(dateStr) } }}
    >
      <div className="mb-1 flex justify-start">
        <span className={cn(
          'flex size-7 items-center justify-center rounded-full text-xs font-medium',
          today && 'bg-primary text-primary-foreground font-bold',
          !today && inMonth && 'text-foreground',
          !today && !inMonth && 'text-muted-foreground',
        )}>
          {date.getDate()}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        {visible.map((evt) => (
          <EventChipWithPopover key={evt.id} event={evt} onEdit={onEditEvent} onDelete={onDeleteEvent} />
        ))}
        {hidden > 0 && (
          <CalendarOverflow events={events} hiddenCount={hidden} open={overflowDay === dateStr}
            onOpenChange={(o) => onOverflowChange(o ? dateStr : null)}
            onSelectEvent={(evt) => { /* handled by chips inside overflow */ }} />
        )}
      </div>
    </div>
  )
}
