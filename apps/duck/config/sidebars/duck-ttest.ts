import { defineSidebar } from './types'

export type DuckTtestHref = '/duck-ttest/changelog' | '/duck-ttest/introduction'

export const duckTtestSidebar = defineSidebar<DuckTtestHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-ttest/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-ttest/changelog' }],
  },
])
