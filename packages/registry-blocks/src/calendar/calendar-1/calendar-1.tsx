'use client'

import { cn } from '@gentleduck/libs/cn'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@gentleduck/registry-ui/breadcrumb'
import { Input } from '@gentleduck/registry-ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui/tabs'
import { CalendarIcon, HomeIcon, SearchIcon } from 'lucide-react'
import * as React from 'react'
import { type CalendarEvent, type CalendarView, type FilterMode, MOCK_EVENTS } from './calendar-data'
import { CalendarEventDetail } from './components/calendar-event-detail'
import { CalendarEventDialog } from './components/calendar-event-dialog'
import { CalendarGrid } from './components/calendar-grid'
import { CalendarToolbar } from './components/calendar-toolbar'
import { CalendarWeekView } from './components/calendar-week-view'
import { CalendarDayView } from './components/calendar-day-view'
import { CalendarYearView } from './components/calendar-year-view'

export default function Page() {
  const [events, setEvents] = React.useState<CalendarEvent[]>(MOCK_EVENTS)
  const [viewedDate, setViewedDate] = React.useState<Date>(new Date(2025, 0, 10))
  const [calendarView, setCalendarView] = React.useState<CalendarView>('month')
  const [filterMode, setFilterMode] = React.useState<FilterMode>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [addEventDate, setAddEventDate] = React.useState<string | null>(null)
  const [editingEvent, setEditingEvent] = React.useState<CalendarEvent | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)
  const [detailEvent, setDetailEvent] = React.useState<CalendarEvent | null>(null)
  const [overflowDay, setOverflowDay] = React.useState<string | null>(null)

  const searchRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredEvents = React.useMemo(() => {
    let filtered = events
    if (filterMode === 'shared') filtered = filtered.filter((e) => e.starred)
    if (searchQuery) { const q = searchQuery.toLowerCase(); filtered = filtered.filter((e) => e.title.toLowerCase().includes(q)) }
    return filtered
  }, [events, filterMode, searchQuery])

  // View-aware navigation
  function handlePrev() {
    setViewedDate((d) => {
      const n = new Date(d)
      switch (calendarView) {
        case 'day': n.setDate(n.getDate() - 1); break
        case 'week': n.setDate(n.getDate() - 7); break
        case 'month': n.setMonth(n.getMonth() - 1); break
        case 'year': n.setFullYear(n.getFullYear() - 1); break
      }
      return n
    })
  }
  function handleNext() {
    setViewedDate((d) => {
      const n = new Date(d)
      switch (calendarView) {
        case 'day': n.setDate(n.getDate() + 1); break
        case 'week': n.setDate(n.getDate() + 7); break
        case 'month': n.setMonth(n.getMonth() + 1); break
        case 'year': n.setFullYear(n.getFullYear() + 1); break
      }
      return n
    })
  }
  function handleToday() { setViewedDate(new Date()) }

  function handleDayClick(dateStr: string) { setAddEventDate(dateStr); setEditingEvent(null); setIsAddEventOpen(true) }
  function handleSaveEvent(event: CalendarEvent) {
    setEvents((prev) => { const idx = prev.findIndex((e) => e.id === event.id); if (idx >= 0) { const next = [...prev]; next[idx] = event; return next } return [...prev, event] })
  }
  function handleDeleteEvent(id: string) { setEvents((prev) => prev.filter((e) => e.id !== id)); setDetailEvent(null) }
  function handleEditEvent(event: CalendarEvent) { setEditingEvent(event); setAddEventDate(null); setIsAddEventOpen(true) }
  function handleSelectEvent(event: CalendarEvent) { setDetailEvent(event); setOverflowDay(null) }
  function handleMonthClick(month: number) { setViewedDate(new Date(viewedDate.getFullYear(), month, 1)); setCalendarView('month') }

  const showEmptyState = filterMode === 'public' || filterMode === 'archived'

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
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
        <div className="relative w-64">
          <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="pl-8 pr-14" />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{"\u2318"}K</kbd>
        </div>
      </div>

      <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as FilterMode)}>
        <TabsList>
          <TabsTrigger value="all">All events</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value={filterMode} className="mt-6 flex flex-col gap-4">
          <CalendarToolbar
            viewedDate={viewedDate} calendarView={calendarView}
            onPrev={handlePrev} onNext={handleNext} onToday={handleToday}
            onViewChange={setCalendarView}
            onAddEvent={() => { setEditingEvent(null); setAddEventDate(null); setIsAddEventOpen(true) }}
          />

          {searchQuery && <p className="text-xs text-muted-foreground">{filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''}</p>}

          {showEmptyState ? (
            <div className="flex min-h-96 flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
              <CalendarIcon className="size-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No {filterMode} events yet</p>
            </div>
          ) : calendarView === 'month' ? (
            <CalendarEventDetail event={detailEvent} open={detailEvent !== null} onOpenChange={(o) => { if (!o) setDetailEvent(null) }} onEdit={handleEditEvent} onDelete={handleDeleteEvent}>
              <div>
                <CalendarGrid viewedMonth={viewedDate} events={filteredEvents} overflowDay={overflowDay}
                  onOverflowChange={setOverflowDay} onDayClick={handleDayClick} onSelectEvent={handleSelectEvent} />
              </div>
            </CalendarEventDetail>
          ) : calendarView === 'week' ? (
            <CalendarWeekView viewedDate={viewedDate} events={filteredEvents} onDayClick={handleDayClick} onSelectEvent={handleSelectEvent} />
          ) : calendarView === 'day' ? (
            <CalendarDayView viewedDate={viewedDate} events={filteredEvents} onSelectEvent={handleSelectEvent} />
          ) : (
            <CalendarYearView viewedDate={viewedDate} events={filteredEvents} onMonthClick={handleMonthClick} />
          )}
        </TabsContent>
      </Tabs>

      <CalendarEventDialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen} onSave={handleSaveEvent} editingEvent={editingEvent} defaultDate={addEventDate} />
    </div>
  )
}
