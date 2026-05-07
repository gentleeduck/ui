import { defineSidebar } from './types'

export type DuckTemplateHref = '/duck-template/introduction'

export const duckTemplateSidebar = defineSidebar<DuckTemplateHref>([
  {
    title: '',
    items: [{ title: 'Introduction', href: '/duck-template/introduction' }],
  },
])
