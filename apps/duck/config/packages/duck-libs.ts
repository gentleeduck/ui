import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckLibsNavItem: ISidebarNavItem = {
  href: '/duck-libs',
  title: 'Gentleduck Libs',
  collapsible: false,
  items: [
    {
      href: '/duck-libs',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckLibsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Libs',
      items: DuckLibsNavItem.items ?? [],
    },
  ],
}
