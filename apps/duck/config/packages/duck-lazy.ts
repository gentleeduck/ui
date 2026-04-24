import type { IDocsConfig } from '@gentleduck/docs'

export const DuckLazyConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-lazy/introduction',
      title: 'Gentleduck Lazy',
      collapsible: false,
      items: [{ href: '/duck-lazy/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
