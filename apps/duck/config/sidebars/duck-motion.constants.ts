import { defineSidebar } from './types'

export type DuckMotionHref = '/duck-motion/changelog' | '/duck-motion/introduction'

export const duckMotionSidebar = defineSidebar<DuckMotionHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-motion/introduction' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/duck-motion/changelog' }],
  },
])
