import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckShortcutNavItem: ISidebarNavItem = {
  href: '/duck-shortcut',
  title: 'Gentleduck Shortcut (Deprecated)',
  collapsible: false,
  items: [
    {
      href: '/duck-shortcut',
      title: 'Overview',
      items: [],
    },
  ],
}

export const DuckShortcutConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Shortcut (Deprecated)',
      items: DuckShortcutNavItem.items ?? [],
    },
  ],
}
