import type { IDocsConfig } from '@gentleduck/docs'

export const DuckGenConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-gen/introduction',
      title: '',
      items: [
        { href: '/duck-gen/introduction', title: 'Introduction', items: [] },
        { href: '/duck-gen/installation', title: 'Installation', items: [] },
      ],
    },
    {
      title: 'Course',
      collapsible: true,
      items: [
        { href: '/duck-gen/course', title: 'Overview', items: [] },
        { href: '/duck-gen/course/the-problem', title: 'Chapter 1: The Problem', items: [] },
        { href: '/duck-gen/course/project-setup', title: 'Chapter 2: Project Setup', items: [] },
        { href: '/duck-gen/course/first-controller', title: 'Chapter 3: Your First Controller', items: [] },
        { href: '/duck-gen/course/generating-types', title: 'Chapter 4: Generating Types', items: [] },
        { href: '/duck-gen/course/using-generated-types', title: 'Chapter 5: Using Generated Types', items: [] },
        { href: '/duck-gen/course/message-keys', title: 'Chapter 6: Message Keys', items: [] },
        { href: '/duck-gen/course/duck-query-client', title: 'Chapter 7: Duck Query Client', items: [] },
        { href: '/duck-gen/course/real-world-patterns', title: 'Chapter 8: Real World Patterns', items: [] },
      ],
    },
    {
      title: 'Guides',
      items: [{ href: '/duck-gen/guides', title: 'Overview', items: [] }],
    },
    {
      title: 'Reference',
      items: [
        { href: '/duck-gen/api-routes', title: 'API Routes', items: [] },
        { href: '/duck-gen/configuration', title: 'Configuration', items: [] },
        { href: '/duck-gen/generated-types', title: 'Generated Types', items: [] },
        { href: '/duck-gen/messages', title: 'Messages', items: [] },
        { href: '/duck-gen/templates', title: 'Templates', items: [] },
      ],
    },
    {
      title: 'Misc',
      items: [{ href: '/duck-gen/changelog', title: 'Changelog', items: [] }],
    },
  ],
}
