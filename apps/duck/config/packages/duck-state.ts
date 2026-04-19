import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckStateNavItem: ISidebarNavItem = {
  href: '/duck-state',
  title: 'Gentleduck State',
  collapsible: false,
  items: [
    {
      href: '/duck-state',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckStateConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck State',
      items: DuckStateNavItem.items ?? [],
    },
  ],
}
