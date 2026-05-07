import { defineSidebar } from './types'

export type DuckGenHref =
  | '/duck-gen/api-routes'
  | '/duck-gen/changelog'
  | '/duck-gen/configuration'
  | '/duck-gen/course'
  | '/duck-gen/course/duck-query-client'
  | '/duck-gen/course/first-controller'
  | '/duck-gen/course/generating-types'
  | '/duck-gen/course/message-keys'
  | '/duck-gen/course/project-setup'
  | '/duck-gen/course/real-world-patterns'
  | '/duck-gen/course/the-problem'
  | '/duck-gen/course/using-generated-types'
  | '/duck-gen/generated-types'
  | '/duck-gen/guides'
  | '/duck-gen/installation'
  | '/duck-gen/introduction'
  | '/duck-gen/messages'
  | '/duck-gen/templates'

export const duckGenSidebar = defineSidebar<DuckGenHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-gen/introduction' },
      { title: 'installation', href: '/duck-gen/installation' },
      { title: 'api routes', href: '/duck-gen/api-routes' },
      { title: 'configuration', href: '/duck-gen/configuration' },
      { title: 'generated types', href: '/duck-gen/generated-types' },
      { title: 'messages', href: '/duck-gen/messages' },
      { title: 'templates', href: '/duck-gen/templates' },
    ],
  },
  {
    title: 'Guides',
    items: [{ title: 'end-to-end guide', href: '/duck-gen/guides' }],
  },
  {
    title: 'Course',
    items: [
      { title: 'Course Overview', href: '/duck-gen/course' },
      { title: 'Chapter 1: The Problem', href: '/duck-gen/course/the-problem' },
      { title: 'Chapter 2: Project Setup', href: '/duck-gen/course/project-setup' },
      { title: 'Chapter 3: Your First Controller', href: '/duck-gen/course/first-controller' },
      { title: 'Chapter 4: Generating Types', href: '/duck-gen/course/generating-types' },
      { title: 'Chapter 5: Using Generated Types', href: '/duck-gen/course/using-generated-types' },
      { title: 'Chapter 6: Message Keys', href: '/duck-gen/course/message-keys' },
      { title: 'Chapter 7: Duck Query Client', href: '/duck-gen/course/duck-query-client' },
      { title: 'Chapter 8: Real World Patterns', href: '/duck-gen/course/real-world-patterns' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-gen/changelog' }],
  },
])
