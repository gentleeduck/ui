import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckLazyNavItem: ISidebarNavItem = {
  href: '/duck-lazy',
  title: 'Gentleduck Lazy',
  collapsible: false,
  items: [
    {
      href: '/duck-lazy',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckLazyConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Lazy',
      items: DuckLazyNavItem.items ?? [],
    },
  ],
}
