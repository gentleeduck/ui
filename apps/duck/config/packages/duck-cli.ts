import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckCliNavItem: ISidebarNavItem = {
  href: '/duck-cli',
  title: 'Gentleduck CLI',
  collapsible: false,
  items: [
    {
      href: '/duck-cli',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckCliConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck CLI',
      items: DuckCliNavItem.items ?? [],
    },
  ],
}
