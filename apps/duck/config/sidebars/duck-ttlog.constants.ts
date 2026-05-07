import { defineSidebar } from './types'

export type DuckTtlogHref = '/duck-ttlog/core' | '/duck-ttlog/introduction' | '/duck-ttlog/macros'

export const duckTtlogSidebar = defineSidebar<DuckTtlogHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/duck-ttlog/introduction' },
      { title: 'Macros', href: '/duck-ttlog/macros' },
    ],
  },
  {
    title: 'Core',
    items: [{ title: 'Core Engine', href: '/duck-ttlog/core' }],
  },
])
