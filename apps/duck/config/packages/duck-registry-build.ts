import type { IDocsConfig } from '@gentleduck/docs'

export const DuckRegistryBuildConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-registry-build/introduction',
      title: '',
      items: [
        { href: '/duck-registry-build/introduction', title: 'Introduction', items: [] },
        { href: '/duck-registry-build/getting-started', title: 'Getting Started', items: [] },
      ],
    },
    {
      title: 'Concepts',
      items: [
        { href: '/duck-registry-build/architecture', title: 'Architecture', items: [] },
        { href: '/duck-registry-build/configuration', title: 'Configuration', items: [] },
      ],
    },
    {
      title: 'Course',
      items: [
        { href: '/duck-registry-build/course', title: 'Overview', items: [] },
        { href: '/duck-registry-build/course-arch-package-index', title: 'Arch Package Index', items: [] },
      ],
    },
    {
      title: 'Reference',
      items: [
        { href: '/duck-registry-build/cli', title: 'CLI', items: [] },
        { href: '/duck-registry-build/reference', title: 'API Reference', items: [] },
        { href: '/duck-registry-build/extensions', title: 'Extensions', items: [] },
      ],
    },
    {
      title: 'Recipes',
      items: [{ href: '/duck-registry-build/recipes', title: 'Recipes', items: [] }],
    },
    {
      title: 'Operations',
      items: [
        { href: '/duck-registry-build/operations', title: 'Operations', items: [] },
        { href: '/duck-registry-build/performance', title: 'Performance', items: [] },
        { href: '/duck-registry-build/testing-ci', title: 'Testing and CI', items: [] },
        { href: '/duck-registry-build/troubleshooting', title: 'Troubleshooting', items: [] },
      ],
    },
  ],
}
