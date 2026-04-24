import type { IDocsConfig } from '@gentleduck/docs'

export const DuckIamConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-iam',
      title: 'Duck IAM',
      label: 'new',
      collapsible: false,
      items: [
        { href: '/duck-iam/introduction', title: 'Introduction', items: [] },
        { href: '/duck-iam/benchmarks', title: 'Benchmarks', items: [] },
        { href: '/duck-iam/installation', title: 'Installation', items: [] },
      ],
    },
    {
      href: '/duck-iam/core',
      title: 'Core',
      collapsible: true,
      items: [{ href: '/duck-iam/core', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-iam/advanced',
      title: 'Advanced',
      collapsible: true,
      items: [{ href: '/duck-iam/advanced', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-iam/integrations',
      title: 'Integrations',
      collapsible: true,
      items: [{ href: '/duck-iam/integrations', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-iam/course',
      title: 'Course',
      collapsible: true,
      items: [{ href: '/duck-iam/course', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-iam/guides',
      title: 'Guides',
      collapsible: true,
      items: [{ href: '/duck-iam/guides', title: 'Overview', items: [] }],
    },
  ],
}
