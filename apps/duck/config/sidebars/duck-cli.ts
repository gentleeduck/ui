import { defineSidebar } from './types'

export type DuckCliHref =
  | '/duck-cli/changelog'
  | '/duck-cli/commands/add'
  | '/duck-cli/commands/diff'
  | '/duck-cli/commands/init'
  | '/duck-cli/commands/list'
  | '/duck-cli/commands/remove'
  | '/duck-cli/commands/theme'
  | '/duck-cli/commands/update'
  | '/duck-cli/guides/monorepo'
  | '/duck-cli/introduction'

export const duckCliSidebar = defineSidebar<DuckCliHref>([
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
