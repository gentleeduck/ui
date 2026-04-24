import type { IDocsConfig } from '@gentleduck/docs'

export const DuckTtlogConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-ttlog',
      title: 'Duck TTLog',
      label: 'new',
      collapsible: false,
      items: [
        { href: '/duck-ttlog/introduction', title: 'Introduction', items: [] },
        { href: '/duck-ttlog/core', title: 'Core Engine', items: [] },
        { href: '/duck-ttlog/macros', title: 'Macros', items: [] },
      ],
    },
  ],
}
