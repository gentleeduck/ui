import type { IDocsConfig } from '@gentleduck/docs'

export const DuckUploadConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-upload',
      title: 'Duck Upload',
      label: 'new',
      collapsible: false,
      items: [
        { href: '/duck-upload/introduction', title: 'Introduction', items: [] },
        { href: '/duck-upload/installation', title: 'Installation', items: [] },
      ],
    },
    {
      href: '/duck-upload/core',
      title: 'Core',
      collapsible: true,
      items: [{ href: '/duck-upload/core', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-upload/react',
      title: 'React',
      collapsible: true,
      items: [{ href: '/duck-upload/react', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-upload/strategies',
      title: 'Strategies',
      collapsible: true,
      items: [{ href: '/duck-upload/strategies', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-upload/design',
      title: 'Design',
      collapsible: true,
      items: [{ href: '/duck-upload/design', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-upload/course',
      title: 'Course',
      collapsible: true,
      items: [{ href: '/duck-upload/course', title: 'Overview', items: [] }],
    },
    {
      href: '/duck-upload/guides',
      title: 'Guides',
      collapsible: true,
      items: [{ href: '/duck-upload/guides', title: 'Overview', items: [] }],
    },
  ],
}
