import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckHooksNavItem: ISidebarNavItem = {
  href: '/duck-hooks',
  title: 'getting-started',
  collapsible: false,
  items: [
    {
      href: '/duck-hooks',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckHooksConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Hooks',
      items: DuckHooksNavItem.items ?? [],
    },
  ],
}
