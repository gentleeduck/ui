'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import type { CalendarEvent } from '../calendar-data'
import { CalendarEventChip } from './calendar-event-chip'

interface CalendarOverflowProps { events: CalendarEvent[]; hiddenCount: number; open: boolean; onOpenChange: (open: boolean) => void; onSelectEvent: (event: CalendarEvent) => void }

export function CalendarOverflow({ events, hiddenCount, open, onOpenChange, onSelectEvent }: CalendarOverflowProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button type="button" role="button" tabIndex={0} className="w-full cursor-pointer rounded px-1.5 py-0.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground">
          + {hiddenCount} more...
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="flex flex-col gap-1">
          <p className="mb-1 text-xs font-semibold text-muted-foreground">All events</p>
          {events.map((event) => <CalendarEventChip key={event.id} event={event} onSelect={onSelectEvent} />)}
        </div>
      </PopoverContent>
    </Popover>
  )
}
