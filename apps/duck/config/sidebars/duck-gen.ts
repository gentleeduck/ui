import { defineSidebar } from './types'

export const duckGenSidebar = defineSidebar([
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
