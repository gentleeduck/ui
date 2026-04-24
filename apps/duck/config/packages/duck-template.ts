import type { IDocsConfig } from '@gentleduck/docs'

export const DuckTemplateConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-template',
      title: 'Duck Template',
      label: 'new',
      collapsible: false,
      items: [{ href: '/duck-template/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
