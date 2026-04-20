import type { IDocsConfig } from '@gentleduck/docs'

export const DuckCliConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-cli',
      title: 'Gentleduck CLI',
      label: 'new',
      collapsible: false,
      items: [{ href: '/duck-cli', title: 'Overview', items: [] }],
    },
  ],
}
