import type { IDocsConfig } from '@gentleduck/docs'

export const DuckCliConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-cli/introduction',
      title: 'Gentleduck CLI',
      label: 'new',
      collapsible: false,
      items: [{ href: '/duck-cli/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
