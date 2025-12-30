import { BookOpen, Boxes, Building2 } from 'lucide-react'
import { MenuCard, MenuItem } from './site-header.types'

const uiDocsBaseUrl = 'https://ui.gentleduck.org'
const genDocsBaseUrl = 'https://gen.gentleduck.org'

export const productCard: MenuCard = {
  className: 'from-zinc-950 via-amber-900/50 to-amber-800/70 border-amber-500/40',
  description: 'Core packages that ship together and scale with your app.',
  href: '/docs',
  icon: Boxes,
  label: 'GentleDuck UI',
  title: 'Build with the full toolkit',
}

export const documentationCard: MenuCard = {
  className: 'from-zinc-950 via-sky-950/50 to-sky-800/70 border-sky-500/40',
  description: 'Guides, references, and install steps for every package.',
  href: '/docs',
  icon: BookOpen,
  label: 'Documentation',
  title: 'Start with the essentials',
}

export const companyCard: MenuCard = {
  className: 'from-zinc-950 via-sky-950/50 to-sky-800/70 border-sky-500/40',
  description: 'Open source, transparent roadmap, and community support.',
  external: true,
  href: 'https://github.com/gentleeduck/duck-ui',
  icon: Building2,
  label: 'Company',
  title: 'Built in public',
}

export const productItems: MenuItem[] = [
  {
    description: 'Production-ready UI components, blocks, and layouts.',
    external: true,
    href: uiDocsBaseUrl,
    title: '@gentleduck/ui',
  },
  {
    description: 'Compiler extension for type-safe API routes and message tags.',
    external: true,
    href: `${genDocsBaseUrl}/docs/installation`,
    title: '@gentleduck/gen',
  },
  {
    description: 'CLI for installing and generating UI assets.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-cli`,
    title: '@gentleduck/cli',
  },
  {
    description: 'Accessible UI primitives for building design systems.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-primitives`,
    title: '@gentleduck/primitives',
  },
  {
    description: 'Reusable React hooks for UI workflows.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-hooks`,
    title: '@gentleduck/hooks',
  },
  {
    description: 'Type-safe variant builder for scalable component APIs.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-variants`,
    title: '@gentleduck/variants',
  },
  {
    description: 'Lazy-loading utilities for images and components.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-lazy`,
    title: '@gentleduck/lazy',
  },
  {
    description: 'Composable utility helpers for the ecosystem.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-libs`,
    title: '@gentleduck/libs',
  },
  {
    description: 'Framework-agnostic keyboard command engine.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-vim`,
    title: '@gentleduck/vim',
  },
  {
    description: 'Type-level testing utilities for TypeScript.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-ttest`,
    title: '@gentleduck/ttest',
  },
  {
    description: 'Rust-powered scaffolding templates for apps.',
    external: true,
    href: `${uiDocsBaseUrl}/docs/packages/duck-template`,
    title: '@gentleduck/template',
  },
]

export const documentationItems: MenuItem[] = [
  {
    description: 'How the stack fits together and where to start.',
    href: '/docs',
    title: 'Overview',
  },
  {
    description: 'Install and configure the Gentleduck toolchain.',
    href: '/docs/installation',
    title: 'Installation',
  },
  {
    description: 'Compiler extension fundamentals and workflows.',
    href: '/docs/duck-gen',
    title: 'Duck Gen Docs',
  },
  {
    description: 'API route contracts, inputs, and shared types.',
    href: '/docs/duck-gen/api-routes',
    title: 'API Routes',
  },
]

export const companyItems = (github: string, twitter?: string): MenuItem[] => [
  {
    description: 'Source, releases, and issue tracking.',
    external: true,
    href: github,
    title: 'GitHub',
  },
  {
    description: 'Roadmap ideas and community support.',
    external: true,
    href: 'https://github.com/gentleeduck/duck-ui/discussions',
    title: 'Discussions',
  },
  {
    description: 'Questions and answers about the Gentleduck ecosystem.',
    external: true,
    href: '/docs/faqs',
    title: 'FAQs',
  },
  {
    description: 'What’s new in the Gentleduck ecosystem.',
    external: true,
    href: '/docs/news',
    title: 'What’s new',
  },
  {
    description: 'Updates and build notes from the team.',
    external: true,
    href: twitter ?? 'https://x.com/wild_ducka',
    title: 'X / Twitter',
  },
  {
    description: 'Join the community on Discord.',
    external: true,
    href: 'https://discord.gg/PwJus4tK',
    title: 'Discord',
  },
]
