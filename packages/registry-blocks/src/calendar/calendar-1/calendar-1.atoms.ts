import { atom } from 'jotai'
import type { CalendarEvent, CalendarView, FilterMode } from './calendar-1.types'
import { MOCK_EVENTS } from './calendar-data'

export const eventsAtom = atom<CalendarEvent[]>(MOCK_EVENTS)
export const viewedDateAtom = atom<Date>(new Date(2026, 2, 10))
export const calendarViewAtom = atom<CalendarView>('month')
export const filterModeAtom = atom<FilterMode>('all')

export const addEventDateAtom = atom<string | null>(null)
export const editingEventAtom = atom<CalendarEvent | null>(null)
export const isAddEventOpenAtom = atom<boolean>(false)
export const overflowDayAtom = atom<string | null>(null)
export const commandOpenAtom = atom<boolean>(false)

export const filteredEventsAtom = atom<CalendarEvent[]>((get) => {
  const events = get(eventsAtom)
  const filter = get(filterModeAtom)
  if (filter === 'shared') return events.filter((e) => e.starred)
  return events
})

export const showEmptyStateAtom = atom<boolean>((get) => {
  const filter = get(filterModeAtom)
  return filter === 'public' || filter === 'archived'
})
