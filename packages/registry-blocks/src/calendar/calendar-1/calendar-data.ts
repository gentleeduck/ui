export type CalendarView = 'month' | 'week' | 'day' | 'year'
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

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; dot: string; text: string }> = {
  standup: { bg: 'bg-sky-50 dark:bg-sky-500/15', dot: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-300' },
  'one-on-one': { bg: 'bg-purple-50 dark:bg-purple-500/15', dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-300' },
  'deep-work': { bg: 'bg-blue-50 dark:bg-blue-500/15', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-300' },
  design: { bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/15', dot: 'bg-fuchsia-500', text: 'text-fuchsia-600 dark:text-fuchsia-300' },
  'all-hands': { bg: 'bg-yellow-50 dark:bg-yellow-500/15', dot: 'bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-300' },
  social: { bg: 'bg-orange-50 dark:bg-orange-500/15', dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-300' },
  external: { bg: 'bg-emerald-50 dark:bg-emerald-500/15', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-300' },
  planning: { bg: 'bg-indigo-50 dark:bg-indigo-500/15', dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-300' },
  review: { bg: 'bg-rose-50 dark:bg-rose-500/15', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-300' },
  personal: { bg: 'bg-teal-50 dark:bg-teal-500/15', dot: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-300' },
  other: { bg: 'bg-zinc-100 dark:bg-zinc-500/15', dot: 'bg-zinc-400', text: 'text-zinc-600 dark:text-zinc-300' },
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  standup: 'Standup', 'one-on-one': '1:1', 'deep-work': 'Deep Work', design: 'Design',
  'all-hands': 'All Hands', social: 'Social', external: 'External', planning: 'Planning',
  review: 'Review', personal: 'Personal', other: 'Other',
}

// Mock data matching the reference design (January 2025)
export const MOCK_EVENTS: CalendarEvent[] = [
  // Week 1: Dec 30 - Jan 5
  { id: 'e01', title: 'Monday standup', date: '2024-12-30', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e02', title: 'Coffee with Alina', date: '2024-12-31', time: '11:30 AM', timeValue: 690, category: 'social' },
  { id: 'e03', title: 'Marketing site...', date: '2024-12-31', time: '2:30 PM', timeValue: 870, category: 'planning' },
  { id: 'e04', title: 'Monday standup', date: '2024-12-31', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e05', title: 'One-on-one wi...', date: '2025-01-02', time: '10:00 AM', timeValue: 600, category: 'one-on-one' },
  { id: 'e06', title: 'All-hands meeti...', date: '2025-01-02', time: '4:00 PM', timeValue: 960, category: 'all-hands' },
  { id: 'e07', title: 'Dinner with C...', date: '2025-01-02', time: '6:30 PM', timeValue: 1110, category: 'external', starred: true },
  { id: 'e08', title: 'Friday standup', date: '2025-01-03', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e09', title: 'House inspe...', date: '2025-01-04', time: '10:30 AM', timeValue: 630, category: 'review', starred: true },
  { id: 'e10', title: "Ava's engagm...", date: '2025-01-05', time: '1:00 PM', timeValue: 780, category: 'social', starred: true },
  // Week 2: Jan 6 - 12
  { id: 'e11', title: 'Monday standup', date: '2025-01-06', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e12', title: 'Content planni...', date: '2025-01-06', time: '11:00 AM', timeValue: 660, category: 'planning' },
  { id: 'e13', title: 'One-on-one wi...', date: '2025-01-07', time: '10:00 AM', timeValue: 600, category: 'one-on-one' },
  { id: 'e14', title: 'Catch up w/ Alex', date: '2025-01-07', time: '2:30 PM', timeValue: 870, category: 'social' },
  { id: 'e15', title: 'Deep work', date: '2025-01-08', time: '9:00 AM', timeValue: 540, category: 'deep-work' },
  { id: 'e16', title: 'Design sync', date: '2025-01-08', time: '10:30 AM', timeValue: 630, category: 'design' },
  { id: 'e17', title: 'SEO planning', date: '2025-01-08', time: '1:30 PM', timeValue: 810, category: 'planning' },
  { id: 'e18', title: 'Lunch with...', date: '2025-01-09', time: '12:00 PM', timeValue: 720, category: 'social', starred: true },
  { id: 'e19', title: 'Friday standup', date: '2025-01-10', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e20', title: 'Olivia x Riley', date: '2025-01-10', time: '10:00 AM', timeValue: 600, category: 'one-on-one' },
  { id: 'e21', title: 'Product demo', date: '2025-01-10', time: '1:30 PM', timeValue: 810, category: 'all-hands' },
  { id: 'e22', title: 'House inspe...', date: '2025-01-11', time: '10:00 AM', timeValue: 600, category: 'review', starred: true },
  { id: 'e23', title: "Ava's engagm...", date: '2025-01-12', time: '1:00 PM', timeValue: 780, category: 'social', starred: true },
  // Week 3: Jan 13 - 19
  { id: 'e24', title: 'Monday standup', date: '2025-01-13', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e25', title: 'Team lunch', date: '2025-01-14', time: '12:15 PM', timeValue: 735, category: 'social' },
  { id: 'e26', title: 'Product planning', date: '2025-01-15', time: '9:30 AM', timeValue: 570, category: 'planning' },
  { id: 'e27', title: "Amelie's first...", date: '2025-01-15', time: '10:00 AM', timeValue: 600, category: 'personal' },
  { id: 'e28', title: 'All-hands meeti...', date: '2025-01-16', time: '4:00 PM', timeValue: 960, category: 'all-hands' },
  { id: 'e29', title: 'Coffee w/ Amelie', date: '2025-01-17', time: '9:30 AM', timeValue: 570, category: 'social' },
  { id: 'e30', title: 'Design feedbac...', date: '2025-01-17', time: '2:30 PM', timeValue: 870, category: 'design' },
  { id: 'e31', title: 'Friday standup', date: '2025-01-17', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e32', title: 'Half maratho...', date: '2025-01-18', time: '7:00 AM', timeValue: 420, category: 'personal', starred: true },
  // Week 4: Jan 20 - 26
  { id: 'e33', title: 'Monday standup', date: '2025-01-20', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e34', title: 'Deep work', date: '2025-01-20', time: '9:15 AM', timeValue: 555, category: 'deep-work' },
  { id: 'e35', title: 'Quarterly review', date: '2025-01-21', time: '11:30 AM', timeValue: 690, category: 'review' },
  { id: 'e36', title: 'Lunch with Zahir', date: '2025-01-21', time: '1:00 PM', timeValue: 780, category: 'social' },
  { id: 'e37', title: 'Dinner with C...', date: '2025-01-21', time: '7:00 PM', timeValue: 1140, category: 'external', starred: true },
  { id: 'e38', title: 'Deep work', date: '2025-01-22', time: '9:00 AM', timeValue: 540, category: 'deep-work' },
  { id: 'e39', title: 'Design sync', date: '2025-01-22', time: '2:30 PM', timeValue: 870, category: 'design' },
  { id: 'e40', title: 'Amelie coffee', date: '2025-01-23', time: '10:00 AM', timeValue: 600, category: 'social' },
  { id: 'e41', title: 'Friday standup', date: '2025-01-24', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e42', title: 'Accountant', date: '2025-01-24', time: '1:45 PM', timeValue: 825, category: 'personal' },
  { id: 'e43', title: 'Marketing site...', date: '2025-01-24', time: '2:30 PM', timeValue: 870, category: 'planning' },
  // Week 5: Jan 27 - Feb 2
  { id: 'e44', title: 'Monday standup', date: '2025-01-27', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e45', title: 'Content planni...', date: '2025-01-28', time: '11:00 AM', timeValue: 660, category: 'planning' },
  { id: 'e46', title: 'Lunch with Alina', date: '2025-01-28', time: '12:45 AM', timeValue: 765, category: 'social' },
  { id: 'e47', title: 'Product planning', date: '2025-01-29', time: '9:30 AM', timeValue: 570, category: 'planning' },
  { id: 'e48', title: 'All-hands meeti...', date: '2025-01-30', time: '4:00 PM', timeValue: 960, category: 'all-hands' },
  { id: 'e49', title: 'Team dinner', date: '2025-01-30', time: '5:30 PM', timeValue: 1050, category: 'social' },
  { id: 'e50', title: 'Friday standup', date: '2025-01-31', time: '9:00 AM', timeValue: 540, category: 'standup' },
  { id: 'e51', title: 'Monday standup', date: '2025-02-01', time: '9:00 AM', timeValue: 540, category: 'standup' },
]
