import { defineSidebar } from './types'

export type DuckCalendarHref =
  | '/duck-calendar/api'
  | '/duck-calendar/api/grid'
  | '/duck-calendar/api/navigation'
  | '/duck-calendar/api/selection'
  | '/duck-calendar/api/use-calendar'
  | '/duck-calendar/api/use-datetime'
  | '/duck-calendar/api/use-time-picker'
  | '/duck-calendar/benchmarks'
  | '/duck-calendar/changelog'
  | '/duck-calendar/course'
  | '/duck-calendar/course/01-introduction'
  | '/duck-calendar/course/02-adapter-pattern'
  | '/duck-calendar/course/03-building-a-grid'
  | '/duck-calendar/course/04-selection-modes'
  | '/duck-calendar/course/05-keyboard-a11y'
  | '/duck-calendar/course/06-time-picker'
  | '/duck-calendar/course/07-styling'
  | '/duck-calendar/course/08-performance'
  | '/duck-calendar/getting-started'
  | '/duck-calendar/guides'
  | '/duck-calendar/guides/accessibility'
  | '/duck-calendar/guides/adapters'
  | '/duck-calendar/guides/styling'
  | '/duck-calendar/introduction'

export const duckCalendarSidebar = defineSidebar<DuckCalendarHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-calendar/introduction' },
      { title: 'Getting Started', href: '/duck-calendar/getting-started' },
    ],
  },
  {
    title: 'API',
    items: [
      { title: 'API Reference', href: '/duck-calendar/api' },
      { title: 'Grid', href: '/duck-calendar/api/grid' },
      { title: 'Navigation', href: '/duck-calendar/api/navigation' },
      { title: 'Selection', href: '/duck-calendar/api/selection' },
      { title: 'useCalendar', href: '/duck-calendar/api/use-calendar' },
      { title: 'useDateTime', href: '/duck-calendar/api/use-datetime' },
      { title: 'useTimePicker', href: '/duck-calendar/api/use-time-picker' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Guides', href: '/duck-calendar/guides' },
      { title: 'Accessibility', href: '/duck-calendar/guides/accessibility' },
      { title: 'Date Adapters', href: '/duck-calendar/guides/adapters' },
      { title: 'Styling', href: '/duck-calendar/guides/styling' },
    ],
  },
  {
    title: 'Course',
    items: [
      { title: 'Course', href: '/duck-calendar/course' },
      { title: 'Lesson 1: Introduction', href: '/duck-calendar/course/01-introduction' },
      { title: 'Lesson 2: Adapter Pattern', href: '/duck-calendar/course/02-adapter-pattern' },
      { title: 'Lesson 3: Building a Grid', href: '/duck-calendar/course/03-building-a-grid' },
      { title: 'Lesson 4: Selection Modes', href: '/duck-calendar/course/04-selection-modes' },
      { title: 'Lesson 5: Keyboard and Accessibility', href: '/duck-calendar/course/05-keyboard-a11y' },
      { title: 'Lesson 6: Time Picker', href: '/duck-calendar/course/06-time-picker' },
      { title: 'Lesson 7: Styling', href: '/duck-calendar/course/07-styling' },
      { title: 'Lesson 8: Performance', href: '/duck-calendar/course/08-performance' },
    ],
  },
  {
    title: 'Benchmarks',
    items: [{ title: 'Benchmarks', href: '/duck-calendar/benchmarks' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-calendar/changelog' }],
  },
])
