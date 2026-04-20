import type { IDocsConfig } from '@gentleduck/docs'

export const DuckStateConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-state',
      title: 'Gentleduck State',
      collapsible: false,
      items: [{ href: '/duck-state', title: 'Overview', items: [] }],
    },
  ],
}
