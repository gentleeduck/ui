import { defineSidebar } from './types'

export const wwwSidebar = defineSidebar([
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
