'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { ClockIcon, StarIcon } from 'lucide-react'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent } from '../calendar-data'
import { formatFullDate } from '../calendar-utils'

interface ICalendarCommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onNavigateToDate: (dateStr: string) => void
}

export function CalendarCommandMenu({
  open,
  onOpenChange,
  events,
  onSelectEvent,
  onNavigateToDate,
}: ICalendarCommandMenuProps) {
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const filtered = React.useMemo(() => {
    if (!query) return events.slice(0, 10)
    const q = query.toLowerCase()
    return events.filter((e) => e.title.toLowerCase().includes(q)).slice(0, 20)
  }, [events, query])

  const grouped = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of filtered) {
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Search events..."
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <CommandList className="max-h-full">
        <CommandEmpty>No events found.</CommandEmpty>
        {grouped.map(([dateStr, evts]) => (
          <CommandGroup key={dateStr} heading={formatFullDate(dateStr)}>
            {evts.map((evt) => {
              const colors = CATEGORY_COLORS[evt.category]
              return (
                <CommandItem
                  key={evt.id}
                  value={evt.id}
                  onSelect={() => {
                    onSelectEvent(evt)
                    onNavigateToDate(evt.date)
                    onOpenChange(false)
                  }}
                  className="flex items-center gap-3">
                  <span className={cn('size-2 shrink-0 rounded-full', colors.dot)} />
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-sm">{evt.title}</span>
                    <span className="text-muted-foreground text-xs">{CATEGORY_LABELS[evt.category]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    {evt.starred && <StarIcon className="size-3 fill-amber-400 text-amber-400" />}
                    <ClockIcon className="size-3" />
                    <span>{evt.time}</span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
