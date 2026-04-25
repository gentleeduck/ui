import type { IDocsConfig } from '@gentleduck/docs'

export const DuckTtlogConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-ttlog/introduction',
      title: '',
      items: [{ href: '/duck-ttlog/introduction', title: 'Introduction', items: [] }],
    },
    {
      title: 'Reference',
      items: [
        { href: '/duck-ttlog/core', title: 'Core Engine', items: [] },
        { href: '/duck-ttlog/macros', title: 'Macros', items: [] },
      ],
    },
  ],
}
