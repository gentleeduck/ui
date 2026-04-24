import type { IDocsConfig } from '@gentleduck/docs'

export const DuckMotionConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-motion/introduction',
      title: 'Gentleduck Motion',
      collapsible: false,
      items: [{ href: '/duck-motion/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
