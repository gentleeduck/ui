import { defineSidebar } from './types'

export type DuckHooksHref = '/duck-hooks/changelog' | '/duck-hooks/introduction'

export const duckHooksSidebar = defineSidebar<DuckHooksHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-hooks/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-hooks/changelog' }],
  },
])
