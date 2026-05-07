import { defineSidebar } from './types'

export type WwwHref =
  | '/www/changelog'
  | '/www/comparisons/vs-radix'
  | '/www/comparisons/vs-react-day-picker'
  | '/www/comparisons/vs-shadcn'
  | '/www/faqs'
  | '/www/installation'
  | '/www/introduction'
  | '/www/mcp'
  | '/www/mdx'
  | '/www/news/building-accessible-uis'
  | '/www/news/component-library'
  | '/www/news/duck-gen-and-query'
  | '/www/news/ecosystem-overview'
  | '/www/news/february-2026-updates'
  | '/www/news/introducing-duck-motion'
  | '/www/news/type-safe-apis-with-duck-gen'
  | '/www/packages'
  | '/www/skills'
  | '/www/whoiam'

export const wwwSidebar = defineSidebar<WwwHref>([
  {
    title: '',
    items: [
      { title: 'Introduction', href: '/www/introduction' },
      { title: 'Installation', href: '/www/installation' },
      { title: 'Packages', href: '/www/packages' },
      { title: 'faqs', href: '/www/faqs' },
    ],
  },
  {
    title: 'News',
    items: [
      { title: 'building accessible uis with duck primitives', href: '/www/news/building-accessible-uis' },
      { title: 'duck gen and duck query', href: '/www/news/duck-gen-and-query' },
      { title: 'february 2026 updates', href: '/www/news/february-2026-updates' },
      { title: 'introducing duck motion', href: '/www/news/introducing-duck-motion' },
      { title: 'the duck ui component library', href: '/www/news/component-library' },
      { title: 'the gentleduck ecosystem', href: '/www/news/ecosystem-overview' },
      { title: 'type-safe apis with duck gen', href: '/www/news/type-safe-apis-with-duck-gen' },
    ],
  },
  {
    title: 'Misc',
    items: [
      { title: 'gentleduck/calendar vs react-day-picker', href: '/www/comparisons/vs-react-day-picker' },
      { title: 'gentleduck/primitives vs Radix UI', href: '/www/comparisons/vs-radix' },
      { title: 'gentleduck/ui vs shadcn/ui', href: '/www/comparisons/vs-shadcn' },
      { title: 'mdx', href: '/www/mdx' },
      { title: 'whoiam', href: '/www/whoiam' },
    ],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelogs', href: '/www/changelog' }],
  },
  {
    title: 'Tooling',
    items: [
      { title: 'Agent Skills', href: '/www/skills' },
      { title: 'MCP Server', href: '/www/mcp' },
    ],
  },
])
