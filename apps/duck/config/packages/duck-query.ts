import type { IDocsConfig } from '@gentleduck/docs'

export const DuckQueryConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-query',
      title: 'Duck Query',
      label: 'new',
      collapsible: false,
      items: [
        { href: '/duck-query/introduction', title: 'Introduction', items: [] },
        { href: '/duck-query/client-methods', title: 'Client Methods', items: [] },
        { href: '/duck-query/advanced', title: 'Advanced', items: [] },
        { href: '/duck-query/types', title: 'Types', items: [] },
      ],
    },
  ],
}
