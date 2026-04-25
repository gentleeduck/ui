import type { IDocsConfig } from '@gentleduck/docs'

export const DuckTemplateConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-template/introduction',
      title: '',
      items: [{ href: '/duck-template/introduction', title: 'Introduction', items: [] }],
    },
  ],
}
