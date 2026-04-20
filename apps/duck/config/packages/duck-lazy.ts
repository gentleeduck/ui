import type { IDocsConfig } from '@gentleduck/docs'

export const DuckLazyConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-lazy',
      title: 'Gentleduck Lazy',
      collapsible: false,
      items: [{ href: '/duck-lazy', title: 'Overview', items: [] }],
    },
  ],
}
