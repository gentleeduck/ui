import { defineSidebar } from './types'

export type DuckStateHref = '/duck-state/changelog' | '/duck-state/introduction'

export const duckStateSidebar = defineSidebar<DuckStateHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-state/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-state/changelog' }],
  },
])
