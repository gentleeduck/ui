'use client'

import { cn } from '@gentleduck/libs/cn'
import { StarIcon } from 'lucide-react'
import { CATEGORY_COLORS, type CalendarEvent } from '../calendar-data'

interface CalendarEventChipProps { event: CalendarEvent; onSelect: (event: CalendarEvent) => void }

export function CalendarEventChip({ event, onSelect }: CalendarEventChipProps) {
  const colors = CATEGORY_COLORS[event.category]
  return (
    <button type="button" tabIndex={0}
      className="flex w-full items-center gap-1 rounded px-1 py-px text-left text-[11px] leading-tight transition-colors cursor-pointer hover:bg-accent/50"
      onClick={(e) => { e.stopPropagation(); onSelect(event) }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onSelect(event) } }}>
      {event.starred ? (
        <StarIcon className={cn('size-2.5 shrink-0 fill-current', colors.text)} />
      ) : (
        <span className={cn('size-1.5 shrink-0 rounded-full', colors.dot)} />
      )}
      <span className={cn('truncate font-medium', colors.text)}>{event.title}</span>
      <span className="ml-auto shrink-0 text-muted-foreground">{event.time}</span>
    </button>
  )
}
