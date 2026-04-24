import type { IDocsConfig } from '@gentleduck/docs'

export const DuckCalendarConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-calendar/introduction',
      collapsible: false,
      title: 'Gentleduck Calendar',
      items: [
        { href: '/duck-calendar/introduction', title: 'Introduction', items: [] },
        { href: '/duck-calendar/getting-started', title: 'Getting Started', items: [] },
        { href: '/duck-calendar/benchmarks', title: 'Benchmarks', label: 'new', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'Guides',
      items: [
        { href: '/duck-calendar/guides/adapters', title: 'Date Adapters', items: [] },
        { href: '/duck-calendar/guides/styling', title: 'Styling', items: [] },
        { href: '/duck-calendar/guides/accessibility', title: 'Accessibility', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'API Reference',
      items: [
        { href: '/duck-calendar/api/use-calendar', title: 'useCalendar', items: [] },
        { href: '/duck-calendar/api/use-time-picker', title: 'useTimePicker', items: [] },
        { href: '/duck-calendar/api/use-datetime', title: 'useDateTime', items: [] },
        { href: '/duck-calendar/api/grid', title: 'Grid Builder', items: [] },
        { href: '/duck-calendar/api/selection', title: 'Selection', items: [] },
        { href: '/duck-calendar/api/navigation', title: 'Navigation', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'Course',
      label: 'try',
      items: [
        { href: '/duck-calendar/course/01-introduction', title: '01: Introduction', items: [] },
        { href: '/duck-calendar/course/02-adapter-pattern', title: '02: Adapter Pattern', items: [] },
        { href: '/duck-calendar/course/03-building-a-grid', title: '03: Building a Grid', items: [] },
        { href: '/duck-calendar/course/04-selection-modes', title: '04: Selection Modes', items: [] },
        { href: '/duck-calendar/course/05-keyboard-a11y', title: '05: Keyboard & A11y', items: [] },
        { href: '/duck-calendar/course/06-time-picker', title: '06: Time Picker', items: [] },
        { href: '/duck-calendar/course/07-styling', title: '07: Styling', items: [] },
        { href: '/duck-calendar/course/08-performance', title: '08: Performance', items: [] },
      ],
    },
  ],
}
