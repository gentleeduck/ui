'use client'

import { cn } from '@gentleduck/libs/cn'
import type { CalendarEvent } from '../calendar-data'
import { isToday, isSameMonth, isWeekend } from '../calendar-utils'
import { CalendarEventChip } from './calendar-event-chip'
import { CalendarOverflow } from './calendar-overflow'

const MAX_VISIBLE = 3

interface CalendarDayCellProps {
  date: Date; viewedMonth: Date; events: CalendarEvent[]; overflowDay: string | null
  onOverflowChange: (day: string | null) => void; onDayClick: (dateStr: string) => void; onSelectEvent: (event: CalendarEvent) => void
}

export function CalendarDayCell({ date, viewedMonth, events, overflowDay, onOverflowChange, onDayClick, onSelectEvent }: CalendarDayCellProps) {
  const inMonth = isSameMonth(date, viewedMonth)
  const today = isToday(date)
  const wkend = isWeekend(date)
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const visible = events.slice(0, MAX_VISIBLE)
  const hidden = events.length - MAX_VISIBLE

  return (
    <div role="gridcell" tabIndex={inMonth ? 0 : -1}
      className={cn('flex min-h-24 flex-col border-b border-r p-1', wkend && 'bg-muted/30', !inMonth && 'opacity-40')}
      onClick={() => { if (inMonth) onDayClick(dateStr) }}
      onKeyDown={(e) => { if (inMonth && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onDayClick(dateStr) } }}>
      <div className="mb-0.5 flex justify-end">
        <span className={cn('flex size-6 items-center justify-center text-xs', today && 'rounded-full bg-primary font-semibold text-primary-foreground', !today && !inMonth && 'text-muted-foreground')}>
          {date.getDate()}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        {visible.map((evt) => <CalendarEventChip key={evt.id} event={evt} onSelect={onSelectEvent} />)}
        {hidden > 0 && <CalendarOverflow events={events} hiddenCount={hidden} open={overflowDay === dateStr} onOpenChange={(o) => onOverflowChange(o ? dateStr : null)} onSelectEvent={onSelectEvent} />}
      </div>
    </div>
  )
}
