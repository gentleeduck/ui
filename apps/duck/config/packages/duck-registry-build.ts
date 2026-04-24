import type { IDocsConfig } from '@gentleduck/docs'

export const DuckRegistryBuildConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      href: '/duck-registry-build/introduction',
      collapsible: false,
      title: 'Gentleduck Registry Build',
      items: [
        { href: '/duck-registry-build/introduction', title: 'Introduction', items: [] },
        { href: '/duck-registry-build/getting-started', title: 'Getting Started', items: [] },
        { href: '/duck-registry-build/architecture', title: 'Architecture', items: [] },
        { href: '/duck-registry-build/recipes', title: 'Recipes', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'Reference',
      items: [
        { href: '/duck-registry-build/configuration', title: 'Configuration', items: [] },
        { href: '/duck-registry-build/extensions', title: 'Extensions', items: [] },
        { href: '/duck-registry-build/cli', title: 'CLI', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'Operations',
      items: [
        { href: '/duck-registry-build/performance', title: 'Performance', items: [] },
        { href: '/duck-registry-build/testing-ci', title: 'Testing and CI', items: [] },
        { href: '/duck-registry-build/troubleshooting', title: 'Troubleshooting', items: [] },
      ],
    },
    {
      collapsible: false,
      title: 'Course',
      items: [
        { href: '/duck-registry-build/course', title: 'Overview', items: [] },
        { href: '/duck-registry-build/course-arch-package-index', title: 'Arch Package Index', items: [] },
      ],
    },
  ],
}
