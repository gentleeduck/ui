'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@gentleduck/registry-ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import { CalendarIcon, HomeIcon } from 'lucide-react'
import * as React from 'react'
import { type CalendarEvent, type CalendarView, type FilterMode, MOCK_EVENTS } from './calendar-data'
import { CalendarEventDetail } from './components/calendar-event-detail'
import { CalendarEventDialog } from './components/calendar-event-dialog'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarToolbar } from './components/calendar-toolbar'

export default function Page() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(MOCK_EVENTS)
  const [viewedMonth, setViewedMonth] = React.useState<Date>(new Date(2025, 0, 1))
  const [calendarView, setCalendarView] = React.useState<CalendarView>('month')
  const [filterMode, setFilterMode] = React.useState<FilterMode>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [addEventDate, setAddEventDate] = React.useState<string | null>(null)
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)
  const [detailEvent, setDetailEvent] = React.useState<CalendarEvent | null>(null)
  const [overflowDay, setOverflowDay] = React.useState<string | null>(null)

  const filteredEvents = React.useMemo(() => {
    let filtered = events
    if (filterMode === 'shared') filtered = filtered.filter((e) => e.starred)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(q))
    }
    return filtered
  }, [events, filterMode, searchQuery])

  function handlePrevMonth() { setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)) }
  function handleNextMonth() { setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)) }
  function handleToday() { setViewedMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) }

  function handleDayClick(dateStr: string) {
    setAddEventDate(dateStr)
    setEditingEvent(null)
    setIsAddEventOpen(true)
  }

  function handleSaveEvent(event: CalendarEvent) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = event; return next }
      return [...prev, event]
    })
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setDetailEvent(null)
  }

  function handleEditEvent(event: CalendarEvent) {
    setEditingEvent(event)
    setAddEventDate(null)
    setIsAddEventOpen(true)
  }

  function handleSelectEvent(event: CalendarEvent) {
    setDetailEvent(event)
    setOverflowDay(null)
  }

  const showEmptyState = filterMode === 'public' || filterMode === 'archived'

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#"><HomeIcon className="size-4" /></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Untitled UI</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Calendar</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-6" />
          <h1 className="font-bold text-2xl">Calendar</h1>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as FilterMode)}>
        <TabsList>
          <TabsTrigger value="all">All events</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={filterMode} className="mt-6 flex flex-col gap-4">
          {/* Toolbar */}
          <CalendarToolbar
            viewedMonth={viewedMonth} calendarView={calendarView} searchQuery={searchQuery}
            onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday}
            onViewChange={setCalendarView} onSearchChange={setSearchQuery}
            onAddEvent={() => { setEditingEvent(null); setAddEventDate(null); setIsAddEventOpen(true) }}
          />

          {/* Search results count */}
          {searchQuery && <p className="text-xs text-muted-foreground">{filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}</p>}

          {/* Content */}
          {showEmptyState ? (
            <div className="flex min-h-96 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
              <CalendarIcon className="size-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No {filterMode} events yet</p>
            </div>
          ) : calendarView === 'month' ? (
            <CalendarEventDetail event={detailEvent} open={detailEvent !== null} onOpenChange={(o) => { if (!o) setDetailEvent(null) }} onEdit={handleEditEvent} onDelete={handleDeleteEvent}>
              <div>
                <CalendarGrid viewedMonth={viewedMonth} events={filteredEvents} overflowDay={overflowDay}
                  onOverflowChange={setOverflowDay} onDayClick={handleDayClick} onSelectEvent={handleSelectEvent} />
              </div>
            </CalendarEventDetail>
          ) : (
            <div className="flex min-h-96 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
              <CalendarIcon className="size-12 text-muted-foreground/40" />
              <p className="font-medium text-sm">
                {calendarView === 'week' ? 'Week' : 'Day'} view coming soon
              </p>
              <p className="text-xs text-muted-foreground">Switch to Month view to see your events</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <CalendarEventDialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen} onSave={handleSaveEvent} editingEvent={editingEvent} defaultDate={addEventDate} />
    </div>
  )
}
