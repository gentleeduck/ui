import { defineSidebar } from './types'

export const duckCliSidebar = defineSidebar([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-cli/introduction' }],
  },
  {
    title: 'Commands',
    items: [
      { title: 'add', href: '/duck-cli/commands/add' },
      { title: 'diff', href: '/duck-cli/commands/diff' },
      { title: 'init', href: '/duck-cli/commands/init' },
      { title: 'list', href: '/duck-cli/commands/list' },
      { title: 'remove', href: '/duck-cli/commands/remove' },
      { title: 'theme', href: '/duck-cli/commands/theme' },
      { title: 'update', href: '/duck-cli/commands/update' },
    ],
  },
  {
    title: 'Guides',
    items: [{ title: 'monorepo usage', href: '/duck-cli/guides/monorepo' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-cli/changelog' }],
  },
])
