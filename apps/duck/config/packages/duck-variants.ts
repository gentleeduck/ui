import type { IDocsConfig } from '@gentleduck/docs'

export const DuckVariantsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-variants',
      title: 'Gentleduck Variants',
      collapsible: false,
      items: [{ href: '/duck-variants', title: 'Overview', items: [] }],
    },
  ],
}
