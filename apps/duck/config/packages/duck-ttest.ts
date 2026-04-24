import type { IDocsConfig } from '@gentleduck/docs'

export const DuckTtestConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-ttest',
      title: 'Duck TType',
      label: 'new',
      collapsible: false,
      items: [{ href: '/duck-ttest/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
