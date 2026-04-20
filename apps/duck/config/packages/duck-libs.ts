import type { IDocsConfig } from '@gentleduck/docs'

export const DuckLibsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-libs',
      title: 'Gentleduck Libs',
      collapsible: false,
      items: [{ href: '/duck-libs', title: 'Overview', items: [] }],
    },
  ],
}
