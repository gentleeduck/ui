import { defineSidebar } from './types'

export type DuckRegistryBuildHref =
  | '/duck-registry-build/architecture'
  | '/duck-registry-build/changelog'
  | '/duck-registry-build/cli'
  | '/duck-registry-build/configuration'
  | '/duck-registry-build/course'
  | '/duck-registry-build/course-arch-package-index'
  | '/duck-registry-build/extensions'
  | '/duck-registry-build/getting-started'
  | '/duck-registry-build/introduction'
  | '/duck-registry-build/operations'
  | '/duck-registry-build/performance'
  | '/duck-registry-build/recipes'
  | '/duck-registry-build/reference'
  | '/duck-registry-build/testing-ci'
  | '/duck-registry-build/troubleshooting'

export const duckRegistryBuildSidebar = defineSidebar<DuckRegistryBuildHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-registry-build/introduction' },
      { title: 'Getting Started', href: '/duck-registry-build/getting-started' },
      { title: 'Arch Package Index', href: '/duck-registry-build/course-arch-package-index' },
      { title: 'Architecture', href: '/duck-registry-build/architecture' },
      { title: 'CLI', href: '/duck-registry-build/cli' },
      { title: 'Configuration', href: '/duck-registry-build/configuration' },
      { title: 'Extensions', href: '/duck-registry-build/extensions' },
      { title: 'Operations', href: '/duck-registry-build/operations' },
      { title: 'Performance', href: '/duck-registry-build/performance' },
      { title: 'Recipes', href: '/duck-registry-build/recipes' },
      { title: 'Reference', href: '/duck-registry-build/reference' },
      { title: 'Testing and CI', href: '/duck-registry-build/testing-ci' },
      { title: 'Troubleshooting', href: '/duck-registry-build/troubleshooting' },
    ],
  },
  {
    title: 'Course',
    items: [{ title: 'Course', href: '/duck-registry-build/course' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-registry-build/changelog' }],
  },
])
