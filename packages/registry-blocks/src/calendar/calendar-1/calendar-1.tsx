'use client'

import { Card } from '@gentleduck/registry-ui/card'
import { Separator } from '@gentleduck/registry-ui/separator'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { type CalendarEvent, type CalendarView, type FilterMode, MOCK_EVENTS } from './calendar-data'
import { CalendarCommandMenu } from './components/calendar-command-menu'
import { CalendarDayView } from './components/calendar-day-view'
import { CalendarEventDialog } from './components/calendar-event-dialog'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarToolbar } from './components/calendar-toolbar'
import { CalendarWeekView } from './components/calendar-week-view'
import { CalendarYearView } from './components/calendar-year-view'

export default function Page() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(MOCK_EVENTS)
  const [viewedDate, setViewedDate] = React.useState<Date>(new Date(2025, 0, 10))
  const [calendarView, setCalendarView] = React.useState<CalendarView>('month')
  const [filterMode, setFilterMode] = React.useState<FilterMode>('all')
  const [addEventDate, setAddEventDate] = React.useState<string | null>(null)
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)
  const [overflowDay, setOverflowDay] = React.useState<string | null>(null)
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredEvents = React.useMemo(() => {
    if (filterMode === 'shared') return events.filter((e) => e.starred)
    return events
  }, [events, filterMode])

  function handlePrev() {
    setViewedDate((d) => {
      const n = new Date(d)
      switch (calendarView) {
        case 'day':
          n.setDate(n.getDate() - 1)
          break
        case 'week':
          n.setDate(n.getDate() - 7)
          break
        case 'month':
          n.setMonth(n.getMonth() - 1)
          break
        case 'year':
          n.setFullYear(n.getFullYear() - 1)
          break
      }
      return n
    })
  }
  function handleNext() {
    setViewedDate((d) => {
      const n = new Date(d)
      switch (calendarView) {
        case 'day':
          n.setDate(n.getDate() + 1)
          break
        case 'week':
          n.setDate(n.getDate() + 7)
          break
        case 'month':
          n.setMonth(n.getMonth() + 1)
          break
        case 'year':
          n.setFullYear(n.getFullYear() + 1)
          break
      }
      return n
    })
  }
  function handleToday() {
    setViewedDate(new Date())
  }
  function handleDayClick(dateStr: string) {
    setAddEventDate(dateStr)
    setEditingEvent(null)
    setIsAddEventOpen(true)
  }
  function handleSaveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = event
        return next
      }
      return [...prev, event]
    })
  }
  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }
  function handleEditEvent(event: CalendarEvent) {
    setEditingEvent(event)
    setAddEventDate(null)
    setIsAddEventOpen(true)
  }
  function handleMonthClick(month: number) {
    setViewedDate(new Date(viewedDate.getFullYear(), month, 1))
    setCalendarView('month')
  }
  function handleNavigateToDate(dateStr: string) {
    const d = new Date(`${dateStr}T00:00:00`)
    setViewedDate(d)
    if (calendarView === 'year') setCalendarView('month')
  }

  const showEmptyState = filterMode === 'public' || filterMode === 'archived'

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col items-center justify-center">
      <Card className="gap-0 p-0">
        {/* Toolbar - single row with everything */}
        <div className="p-4">
          <CalendarToolbar
            viewedDate={viewedDate}
            calendarView={calendarView}
            filterMode={filterMode}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            onViewChange={setCalendarView}
            onFilterChange={setFilterMode}
            onSearchOpen={() => setCommandOpen(true)}
            onAddEvent={() => {
              setEditingEvent(null)
              setAddEventDate(null)
              setIsAddEventOpen(true)
            }}
          />
        </div>
        <Separator />

        {/* Calendar content */}
        <div>
          {showEmptyState ? (
            <div className="flex min-h-96 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-card">
              <CalendarIcon className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">No {filterMode} events yet</p>
            </div>
          ) : calendarView === 'month' ? (
            <CalendarGrid
              viewedMonth={viewedDate}
              events={filteredEvents}
              overflowDay={overflowDay}
              onOverflowChange={setOverflowDay}
              onDayClick={handleDayClick}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : calendarView === 'week' ? (
            <CalendarWeekView
              viewedDate={viewedDate}
              events={filteredEvents}
              onDayClick={handleDayClick}
              onSelectEvent={() => {}}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : calendarView === 'day' ? (
            <CalendarDayView
              viewedDate={viewedDate}
              events={filteredEvents}
              onSelectEvent={() => {}}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <CalendarYearView viewedDate={viewedDate} events={filteredEvents} onMonthClick={handleMonthClick} />
          )}
        </div>

        <CalendarCommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          events={filteredEvents}
          onSelectEvent={(evt) => handleEditEvent(evt)}
          onNavigateToDate={handleNavigateToDate}
        />
        <CalendarEventDialog
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          onSave={handleSaveEvent}
          editingEvent={editingEvent}
          defaultDate={addEventDate}
        />
      </Card>
    </div>
  )
}
