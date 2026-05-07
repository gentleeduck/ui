import { defineSidebar } from './types'

export type DuckQueryHref =
  | '/duck-query/advanced'
  | '/duck-query/changelog'
  | '/duck-query/client-methods'
  | '/duck-query/introduction'
  | '/duck-query/types'

export const duckQuerySidebar = defineSidebar<DuckQueryHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-query/introduction' },
      { title: 'client methods', href: '/duck-query/client-methods' },
      { title: 'types', href: '/duck-query/types' },
    ],
  },
  {
    title: 'Advanced',
    items: [{ title: 'advanced', href: '/duck-query/advanced' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-query/changelog' }],
  },
])
