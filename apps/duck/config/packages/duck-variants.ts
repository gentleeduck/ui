import type { IDocsConfig } from '@gentleduck/docs'

export const DuckVariantsConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-variants/introduction',
      title: 'Gentleduck Variants',
      collapsible: false,
      items: [{ href: '/duck-variants/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
