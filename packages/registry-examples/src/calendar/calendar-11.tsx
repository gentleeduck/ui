'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new NativeAdapter()

const EVENTS: Record<string, { title: string; color: string }[]> = {
  '2026-2-15': [
    { title: 'Team standup', color: '#3b82f6' },
    { title: 'Design review', color: '#8b5cf6' },
  ],
  '2026-2-18': [
    { title: 'Sprint planning', color: '#f59e0b' },
    { title: '1:1 with manager', color: '#10b981' },
  ],
  '2026-2-20': [{ title: 'Product launch', color: '#ef4444' }],
  '2026-2-25': [
    { title: 'Team retrospective', color: '#3b82f6' },
    { title: 'All-hands meeting', color: '#8b5cf6' },
    { title: 'Stakeholder demo', color: '#f59e0b' },
  ],
}

function getKey(d: Date) {
  return `${adapter.getYear(d)}-${adapter.getMonth(d)}-${adapter.getDate(d)}`
}

function getEvents(d: Date) {
  return EVENTS[getKey(d)] ?? []
}

export default function Demo() {
  const [selected, setSelected] = React.useState<Date | null>(new Date())
  const selectedEvents = selected ? getEvents(selected) : []

  return (
    <div className="flex gap-6">
      <Calendar
        className="rounded-md border shadow-sm"
        mode="single"
        selected={selected}
        onSelect={setSelected}
        fixedWeeks
        showDropdowns
        renderDay={(day, children) => {
          const events = getEvents(day.date)
          if (events.length === 0) return children
          return (
            <span className="flex flex-col items-center gap-0.5">
              {children}
              <span className="flex gap-0.5">
                {events.slice(0, 3).map((e) => (
                  <span key={e.title} className="size-1 rounded-full" style={{ backgroundColor: e.color }} />
                ))}
              </span>
            </span>
          )
        }}
      />
      <div className="min-w-[200px] space-y-2">
        <h3 className="font-semibold text-sm">
          {selected?.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        {selectedEvents.length > 0 ? (
          <ul className="space-y-1">
            {selectedEvents.map((event) => (
              <li key={event.title} className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full" style={{ backgroundColor: event.color }} />
                {event.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No events</p>
        )}
      </div>
    </div>
  )
}
