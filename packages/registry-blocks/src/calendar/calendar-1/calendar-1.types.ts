export type CalendarView = 'month' | 'week' | 'day' | 'year'
export type FilterMode = 'all' | 'shared' | 'public' | 'archived'
export type EventCategory =
  | 'standup'
  | 'one-on-one'
  | 'deep-work'
  | 'design'
  | 'all-hands'
  | 'social'
  | 'external'
  | 'planning'
  | 'review'
  | 'personal'
  | 'other'

export type Attendee = {
  name: string
  email: string
  avatar?: string
}

export type CalendarEvent = {
  id: string
  title: string
  date: string
  time: string
  timeValue: number
  category: EventCategory
  starred?: boolean
  description?: string
  location?: string
  link?: string
  attendees?: Attendee[]
}
