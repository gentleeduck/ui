import type { IDocsConfig } from '@gentleduck/docs'

export const DuckShortcutConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-shortcut/introduction',
      title: 'Gentleduck Shortcut (Deprecated)',
      collapsible: false,
      items: [{ href: '/duck-shortcut/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
