import type { IDocsConfig } from '@gentleduck/docs'

export const DuckGenConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-gen',
      title: 'Duck Gen',
      label: 'new',
      collapsible: false,
      items: [
        { href: '/duck-gen/introduction', title: 'Introduction', items: [] },
        { href: '/duck-gen/installation', title: 'Installation', items: [] },
        { href: '/duck-gen/api-routes', title: 'API Routes', items: [] },
        { href: '/duck-gen/configuration', title: 'Configuration', items: [] },
        { href: '/duck-gen/generated-types', title: 'Generated Types', items: [] },
        { href: '/duck-gen/messages', title: 'Messages', items: [] },
        { href: '/duck-gen/templates', title: 'Templates', items: [] },
        { href: '/duck-gen/changelog', title: 'Changelog', items: [] },
      ],
    },
    {
      href: '/duck-gen/course',
      title: 'Course',
      collapsible: true,
      items: [{ href: '/duck-gen/course', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-gen/guides',
      title: 'Guides',
      collapsible: true,
      items: [{ href: '/duck-gen/guides', title: 'Overview', items: [] }],
    },
  ],
}
