'use client'

import { cn } from '@gentleduck/libs/cn'
import { StarIcon } from 'lucide-react'
import { CATEGORY_COLORS, type CalendarEvent } from '../calendar-data'

interface CalendarEventChipProps { event: CalendarEvent; onSelect: (event: CalendarEvent) => void }

export function CalendarEventChip({ event, onSelect }: CalendarEventChipProps) {
  const colors = CATEGORY_COLORS[event.category]
  return (
    <button type="button" role="button" tabIndex={0}
      className={cn('flex w-full items-center gap-1.5 rounded-md px-1.5 py-0.5 text-left text-xs transition-colors cursor-pointer hover:opacity-80', colors.bg)}
      onClick={(e) => { e.stopPropagation(); onSelect(event) }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onSelect(event) } }}>
      {event.starred ? <StarIcon className="size-3 shrink-0 fill-amber-400 text-amber-400" /> : <span className={cn('size-1.5 shrink-0 rounded-full', colors.dot)} />}
      <span className="flex-1 truncate">{event.title}</span>
      <span className="shrink-0 text-muted-foreground">{event.time}</span>
    </button>
  )
}
