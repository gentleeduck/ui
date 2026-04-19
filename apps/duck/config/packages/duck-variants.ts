import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckVariantsNavItem: ISidebarNavItem = {
  href: '/duck-variants',
  title: 'Gentleduck Variants',
  collapsible: false,
  items: [
    {
      href: '/duck-variants',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckVariantsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Variants',
      items: DuckVariantsNavItem.items ?? [],
    },
  ],
}
