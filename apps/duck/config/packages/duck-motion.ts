import type { IDocsConfig } from '@gentleduck/docs'

export const DuckMotionConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-motion',
      title: 'Gentleduck Motion',
      collapsible: false,
      items: [{ href: '/duck-motion', title: 'Overview', items: [] }],
    },
  ],
}
