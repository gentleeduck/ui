import type { IDocsConfig } from '@gentleduck/docs'

export const DuckShortcutConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-shortcut',
      title: 'Gentleduck Shortcut (Deprecated)',
      collapsible: false,
      items: [{ href: '/duck-shortcut', title: 'Overview', items: [] }],
    },
  ],
}
