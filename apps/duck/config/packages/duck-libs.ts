import type { IDocsConfig } from '@gentleduck/docs'

export const DuckLibsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-libs/introduction',
      title: 'Gentleduck Libs',
      collapsible: false,
      items: [{ href: '/duck-libs/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
