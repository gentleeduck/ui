import { defineSidebar } from './types'

export type DuckVariantsHref = '/duck-variants/changelog' | '/duck-variants/introduction'

export const duckVariantsSidebar = defineSidebar<DuckVariantsHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-variants/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-variants/changelog' }],
  },
])
