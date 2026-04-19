import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export const DuckRegistryBuildNavItem: ISidebarNavItem = {
  href: '/duck-registry-build',
  title: 'Gentleduck Registry Build',
  label: 'new',
  collapsible: true,
  items: [
    {
      href: '/duck-registry-build',
      title: 'Overview',
      items: [],
    },
    {
      href: '/duck-registry-build/getting-started',
      title: 'Getting Started',
      items: [],
    },
    {
      href: '/duck-registry-build/architecture',
      title: 'Architecture',
      items: [],
    },
    {
      href: '/duck-registry-build/reference',
      title: 'Reference',
      collapsible: true,
      items: [
        {
          href: '/duck-registry-build/configuration',
          title: 'Configuration',
          items: [],
        }
,
        {
          href: '/duck-registry-build/extensions',
          title: 'Extensions',
          items: [],
        }
,
        {
          href: '/duck-registry-build/cli',
          title: 'CLI',
          items: [],
        }
,
      ],
    },
    {
      href: '/duck-registry-build/operations',
      title: 'Operations',
      collapsible: true,
      items: [
        {
          href: '/duck-registry-build/performance',
          title: 'Performance',
          items: [],
        }
,
        {
          href: '/duck-registry-build/testing-ci',
          title: 'Testing and CI',
          items: [],
        }
,
        {
          href: '/duck-registry-build/troubleshooting',
          title: 'Troubleshooting',
          items: [],
        }
,
      ],
    },
    {
      href: '/duck-registry-build/recipes',
      title: 'Recipes',
      items: [],
    },
    {
      href: '/duck-registry-build/course',
      title: 'Course',
      collapsible: true,
      items: [
        {
          href: '/duck-registry-build/course',
          title: 'Overview',
          items: [],
        }
,
        {
          href: '/duck-registry-build/course-arch-package-index',
          title: 'Arch Package Index',
          items: [],
        }
,
      ],
    },
  ],
}

export const DuckRegistryBuildConfig: IDocsConfig = {
  mainNav: [],
  chartsNav: [],
  sidebarNav: [
    {
      collapsible: false,
      title: 'Gentleduck Registry Build',
      items: DuckRegistryBuildNavItem.items ?? [],
    },
  ],
}
