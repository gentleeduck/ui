import { defineSidebar } from './types'

export type DuckLazyHref = '/duck-lazy/changelog' | '/duck-lazy/introduction'

export const duckLazySidebar = defineSidebar<DuckLazyHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-lazy/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-lazy/changelog' }],
  },
])
