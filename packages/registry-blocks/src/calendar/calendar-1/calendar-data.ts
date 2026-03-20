export type CalendarView = 'month' | 'week' | 'day'
export type FilterMode = 'all' | 'shared' | 'public' | 'archived'
export type EventCategory = 'standup' | 'one-on-one' | 'deep-work' | 'design' | 'all-hands' | 'social' | 'external' | 'planning' | 'review' | 'personal' | 'other'

export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  timeValue: number
  category: EventCategory
  starred?: boolean
}

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; dot: string }> = {
  standup: { bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  'one-on-one': { bg: 'bg-violet-500/10', dot: 'bg-violet-500' },
  'deep-work': { bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  design: { bg: 'bg-pink-500/10', dot: 'bg-pink-500' },
  'all-hands': { bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  social: { bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  external: { bg: 'bg-cyan-500/10', dot: 'bg-cyan-500' },
  planning: { bg: 'bg-indigo-500/10', dot: 'bg-indigo-500' },
  review: { bg: 'bg-rose-500/10', dot: 'bg-rose-500' },
  personal: { bg: 'bg-teal-500/10', dot: 'bg-teal-500' },
  other: { bg: 'bg-zinc-500/10', dot: 'bg-zinc-500' },
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  standup: 'Standup', 'one-on-one': '1:1', 'deep-work': 'Deep Work', design: 'Design',
  'all-hands': 'All Hands', social: 'Social', external: 'External', planning: 'Planning',
  review: 'Review', personal: 'Personal', other: 'Other',
}

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'evt-001', title: 'Monday Standup', date: '2025-01-06', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-002', title: 'Monday Standup', date: '2025-01-13', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-003', title: 'Monday Standup', date: '2025-01-20', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-004', title: 'Monday Standup', date: '2025-01-27', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-005', title: 'Friday Standup', date: '2025-01-03', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-006', title: 'Friday Standup', date: '2025-01-10', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-007', title: 'Friday Standup', date: '2025-01-17', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-008', title: 'Friday Standup', date: '2025-01-24', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-009', title: 'Friday Standup', date: '2025-01-31', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'evt-010', title: 'Design Review', date: '2025-01-07', time: '10:30 AM', timeValue: 630, category: 'design' },
  { id: 'evt-011', title: 'Sprint Planning', date: '2025-01-06', time: '2:00 PM', timeValue: 840, category: 'planning' },
  { id: 'evt-012', title: '1:1 with Manager', date: '2025-01-08', time: '11:00 AM', timeValue: 660, category: 'one-on-one', starred: true },
  { id: 'evt-013', title: 'Team Lunch', date: '2025-01-09', time: '12:00 PM', timeValue: 720, category: 'social' },
  { id: 'evt-014', title: 'All Hands Meeting', date: '2025-01-15', time: '3:00 PM', timeValue: 900, category: 'all-hands' },
  { id: 'evt-015', title: 'Code Review Session', date: '2025-01-14', time: '10:00 AM', timeValue: 600, category: 'review' },
  { id: 'evt-016', title: 'Deep Work Block', date: '2025-01-16', time: '9:00 AM', timeValue: 540, category: 'deep-work' },
  { id: 'evt-017', title: 'Client Call', date: '2025-01-09', time: '4:00 PM', timeValue: 960, category: 'external', starred: true },
  { id: 'evt-018', title: 'Retrospective', date: '2025-01-17', time: '3:00 PM', timeValue: 900, category: 'review' },
  { id: 'evt-019', title: 'Product Demo', date: '2025-01-22', time: '2:00 PM', timeValue: 840, category: 'all-hands', starred: true },
  { id: 'evt-020', title: 'Workshop: Accessibility', date: '2025-01-23', time: '10:00 AM', timeValue: 600, category: 'design' },
  { id: 'evt-021', title: 'Team Happy Hour', date: '2025-01-24', time: '5:00 PM', timeValue: 1020, category: 'social' },
  { id: 'evt-022', title: 'Investor Update', date: '2025-01-28', time: '11:00 AM', timeValue: 660, category: 'external', starred: true },
  { id: 'evt-023', title: 'Performance Reviews', date: '2025-01-29', time: '10:00 AM', timeValue: 600, category: 'one-on-one' },
  { id: 'evt-024', title: 'Architecture Discussion', date: '2025-01-30', time: '1:00 PM', timeValue: 780, category: 'planning' },
  { id: 'evt-025', title: 'Personal Errand', date: '2025-01-10', time: '3:00 PM', timeValue: 900, category: 'personal' },
  { id: 'evt-026', title: 'Morning Sync', date: '2025-01-09', time: '9:30 AM', timeValue: 570, category: 'standup' },
]
