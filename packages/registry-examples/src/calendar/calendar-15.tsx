'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import * as React from 'react'

const adapter = new NativeAdapter()

const EVENTS: Record<string, { title: string; time: string; color: string }[]> = {
  '2026-3-5': [
    { title: 'Team standup', time: '9:00 AM', color: '#3b82f6' },
    { title: 'Design review', time: '2:00 PM', color: '#a855f7' },
  ],
  '2026-3-12': [{ title: 'Sprint planning', time: '10:00 AM', color: '#f59e0b' }],
  '2026-3-18': [
    { title: '1:1 with manager', time: '11:00 AM', color: '#22c55e' },
    { title: 'Product demo', time: '3:00 PM', color: '#ef4444' },
    { title: 'Team dinner', time: '7:00 PM', color: '#ec4899' },
  ],
  '2026-3-25': [{ title: 'Release day', time: '9:00 AM', color: '#f97316' }],
}

function getKey(d: Date) {
  return `${adapter.getYear(d)}-${adapter.getMonth(d) + 1}-${adapter.getDate(d)}`
}

function getEvents(d: Date) {
  return EVENTS[getKey(d)] ?? []
}

export default function Demo() {
  const [selected, setSelected] = React.useState<Date | null>(null)
  const [popoverDate, setPopoverDate] = React.useState<Date | null>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)
  const [popoverPos, setPopoverPos] = React.useState<{ top: number; left: number } | null>(null)
  const popoverEvents = popoverDate ? getEvents(popoverDate) : []

  const openPopover = React.useCallback((date: Date) => {
    if (!calendarRef.current) return
    const calendarRect = calendarRef.current.getBoundingClientRect()
    const cellButton = calendarRef.current.querySelector(
      `button[data-day="${date.toLocaleDateString()}"]`,
    ) as HTMLElement | null
    if (!cellButton) return
    const cellRect = cellButton.getBoundingClientRect()
    setPopoverPos({
      top: cellRect.bottom - calendarRect.top + 4,
      left: cellRect.left - calendarRect.left + cellRect.width / 2,
    })
    setPopoverDate(date)
  }, [])

  React.useEffect(() => {
    if (!popoverDate) return
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest('[data-slot="event-popover"]')) return
      if (target.closest('[data-slot="calendar"]')) return
      setPopoverDate(null)
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setPopoverDate(null)
    }
    document.addEventListener('pointerdown', handleClick, true)
    document.addEventListener('keydown', handleEscape, true)
    return () => {
      document.removeEventListener('pointerdown', handleClick, true)
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [popoverDate])

  return (
    <div className="relative">
      <Calendar
        ref={calendarRef}
        className="rounded-md border shadow-sm"
        mode="single"
        defaultMonth={new Date(2026, 2, 1)}
        selected={selected}
        showDropdowns={false}
        onSelect={(date) => {
          setSelected(date as Date | null)
          if (date && getEvents(date as Date).length > 0) {
            openPopover(date as Date)
          } else {
            setPopoverDate(null)
          }
        }}
        renderDay={(day, children) => {
          const events = getEvents(day.date)
          if (events.length === 0) return children
          return (
            <span className="flex flex-col items-center gap-0.5">
              {children}
              <span className="flex gap-0.5">
                {events.slice(0, 3).map((event) => (
                  <span key={event.title} className="size-1 rounded-full" style={{ backgroundColor: event.color }} />
                ))}
              </span>
            </span>
          )
        }}
      />
      <div
        data-slot="event-popover"
        data-state={popoverDate ? 'open' : 'closed'}
        className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 absolute z-50 w-auto -translate-x-1/2 rounded-md border bg-popover p-3 text-popover-foreground shadow-md transition-all transition-discrete duration-150 ease-(--gentleduck-motion-ease) data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=open]:animate-in"
        style={popoverPos ? { top: popoverPos.top, left: popoverPos.left } : undefined}>
        {popoverDate && (
          <>
            <p className="mb-2 whitespace-nowrap font-medium text-sm">
              {popoverDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="space-y-1.5">
              {popoverEvents.map((event) => (
                <div key={event.title} className="flex items-center gap-2 whitespace-nowrap text-sm">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                  <span className="font-medium">{event.title}</span>
                  <span className="text-muted-foreground">{event.time}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
