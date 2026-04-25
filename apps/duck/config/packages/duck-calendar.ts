import type { IDocsConfig } from '@gentleduck/docs'

export const DuckCalendarConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-calendar/introduction',
      title: 'Getting Started',
      items: [
        { href: '/duck-calendar/introduction', title: 'Introduction', items: [] },
        { href: '/duck-calendar/getting-started', title: 'Getting Started', items: [] },
      ],
    },
    {
      title: 'Guides',
      items: [
        { href: '/duck-calendar/guides', title: 'Overview', items: [] },
        { href: '/duck-calendar/guides/adapters', title: 'Date Adapters', items: [] },
        { href: '/duck-calendar/guides/styling', title: 'Styling', items: [] },
        { href: '/duck-calendar/guides/accessibility', title: 'Accessibility', items: [] },
      ],
    },
    {
      title: 'API',
      items: [
        { href: '/duck-calendar/api', title: 'Overview', items: [] },
        { href: '/duck-calendar/api/grid', title: 'Grid', items: [] },
        { href: '/duck-calendar/api/navigation', title: 'Navigation', items: [] },
        { href: '/duck-calendar/api/selection', title: 'Selection', items: [] },
        { href: '/duck-calendar/api/use-calendar', title: 'useCalendar', items: [] },
        { href: '/duck-calendar/api/use-datetime', title: 'useDateTime', items: [] },
        { href: '/duck-calendar/api/use-time-picker', title: 'useTimePicker', items: [] },
      ],
    },
    {
      title: 'Resources',
      items: [{ href: '/duck-calendar/benchmarks', title: 'Benchmarks', items: [] }],
    },
    {
      title: 'Course',
      items: [
        { href: '/duck-calendar/course', title: 'Overview', items: [] },
        { href: '/duck-calendar/course/01-introduction', title: 'Introduction', items: [] },
        { href: '/duck-calendar/course/02-adapter-pattern', title: 'Adapter Pattern', items: [] },
        { href: '/duck-calendar/course/03-building-a-grid', title: 'Building a Grid', items: [] },
        { href: '/duck-calendar/course/04-selection-modes', title: 'Selection Modes', items: [] },
        {
          href: '/duck-calendar/course/05-keyboard-a11y',
          title: 'Keyboard and Accessibility',
          items: [],
        },
        { href: '/duck-calendar/course/06-time-picker', title: 'Time Picker', items: [] },
        { href: '/duck-calendar/course/07-styling', title: 'Styling', items: [] },
        { href: '/duck-calendar/course/08-performance', title: 'Performance', items: [] },
      ],
    },
  ],
}
