import type { IDocsConfig } from '@gentleduck/docs'

export const DuckHooksConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-hooks',
      title: 'Gentleduck Hooks',
      collapsible: false,
      items: [{ href: '/duck-hooks', title: 'Overview', items: [] }],
    },
  ],
}
