import type { CalendarEvent } from './calendar-data'

export function getWeeksForMonth(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = new Date(firstDay)
  const dow = startDay.getDay()
  startDay.setDate(startDay.getDate() + (dow === 0 ? -6 : 1 - dow))
  const weeks: Date[][] = []
  const current = new Date(startDay)
  while (current <= lastDay || weeks.length < 5) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
    if (weeks.length >= 6) break
  }
  return weeks
}

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const ds = formatDateString(date)
  return events.filter((e) => e.date === ds).sort((a, b) => a.timeValue - b.timeValue)
}

export function formatDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatDateRange(date: Date): string {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(first)} - ${fmt(last)}`
}

export function formatFullDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function isToday(date: Date): boolean {
  const n = new Date()
  return date.getFullYear() === n.getFullYear() && date.getMonth() === n.getMonth() && date.getDate() === n.getDate()
}

export function isSameMonth(date: Date, month: Date): boolean {
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()
}

export function parseTimeToMinutes(time: string): number {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return 0
  let h = Number.parseInt(m[1] ?? '0', 10)
  const min = Number.parseInt(m[2] ?? '0', 10)
  const p = m[3]?.toUpperCase()
  if (p === 'PM' && h !== 12) h += 12
  if (p === 'AM' && h === 12) h = 0
  return h * 60 + min
}

export function isWeekend(date: Date): boolean {
  const d = date.getDay()
  return d === 0 || d === 6
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const dow = d.getDay()
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1))
  return d
}

export function getDaysForWeek(date: Date): Date[] {
  const start = getWeekStart(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function formatViewHeading(date: Date, view: string): string {
  switch (view) {
    case 'day':
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    case 'week': {
      const start = getWeekStart(date)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return `${fmt(start)} - ${fmt(end)}, ${end.getFullYear()}`
    }
    case 'year':
      return String(date.getFullYear())
    default:
      return formatMonthYear(date)
  }
}

export function formatViewSubheading(date: Date, view: string): string {
  switch (view) {
    case 'day':
      return ''
    case 'week': {
      const start = getWeekStart(date)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      return `${fmt(start)} - ${fmt(end)}`
    }
    case 'year':
      return `Jan 1, ${date.getFullYear()} - Dec 31, ${date.getFullYear()}`
    default:
      return formatDateRange(date)
  }
}
