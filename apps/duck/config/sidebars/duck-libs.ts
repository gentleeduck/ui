import { defineSidebar } from './types'

export type DuckLibsHref = '/duck-libs/changelog' | '/duck-libs/introduction'

export const duckLibsSidebar = defineSidebar<DuckLibsHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-libs/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-libs/changelog' }],
  },
])
