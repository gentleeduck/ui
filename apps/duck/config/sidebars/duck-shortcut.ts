import { defineSidebar } from './types'

export type DuckShortcutHref = '/duck-shortcut/changelog' | '/duck-shortcut/introduction'

export const duckShortcutSidebar = defineSidebar<DuckShortcutHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-shortcut/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-shortcut/changelog' }],
  },
])
