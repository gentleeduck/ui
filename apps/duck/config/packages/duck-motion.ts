import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckMotionNavItem: ISidebarNavItem = {
  href: '/duck-motion',
  title: 'Gentleduck Motion',
  collapsible: false,
  items: [
    {
      href: '/duck-motion',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckMotionConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Motion',
      items: DuckMotionNavItem.items ?? [],
    },
  ],
}
