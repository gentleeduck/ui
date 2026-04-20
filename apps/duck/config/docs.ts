import type { IDocsConfig } from '@gentleduck/docs/context'
import {
  Box,
  Calendar,
  Command,
  Database,
  FileCode2,
  ImageIcon,
  Keyboard,
  KeyRound,
  LayoutGrid,
  Library,
  Link2,
  Palette,
  ScrollText,
  Sparkles,
  Terminal,
  Upload,
} from 'lucide-react'
import { docs } from '~/.velite'

// import { DuckCalendarConfig } from './packages/duck-calendar'
// import { DuckCliConfig } from './packages/duck-cli'
// import { DuckHooksConfig } from './packages/duck-hooks'
// import { DuckLazyConfig } from './packages/duck-lazy'
// import { DuckLibsConfig } from './packages/duck-libs'
// import { DuckMotionConfig } from './packages/duck-motion'
// import { DuckPrimitivesConfig } from './packages/duck-primitives'
// import { DuckRegistryBuildConfig } from './packages/duck-registry-build'
// import { DuckShortcutConfig } from './packages/duck-shortcut'
// import { DuckStateConfig } from './packages/duck-state'
// import { DuckUiConfig } from './packages/duck-ui'
// import { DuckVariantsConfig } from './packages/duck-variants'
// import { DuckVimConfig } from './packages/duck-vim'

export * from './packages/duck-calendar'
export * from './packages/duck-cli'
export * from './packages/duck-hooks'
export * from './packages/duck-lazy'
export * from './packages/duck-libs'
export * from './packages/duck-motion'
export * from './packages/duck-primitives'
export * from './packages/duck-registry-build'
export * from './packages/duck-shortcut'
export * from './packages/duck-state'
export * from './packages/duck-ui'
export * from './packages/duck-variants'
export * from './packages/duck-vim'

export const docsConfig: IDocsConfig = {
  chartsNav: [],
  mainNav: [],
  sidebarNav: [],
}

export const docsEntries = docs.map((doc) => {
  const slug = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`
  return {
    component: doc.component,
    permalink: slug,
    slug,
    title: doc.title,
    toc: doc.toc,
  }
})

export const navItems = [
  {
    title: 'Packages',
    href: '/duck-ui',
    description: 'Core packages that ship together and scale with your app.',
    items: [
      {
        title: '@gentleduck/ui',
        href: '/duck-ui',
        description: 'Production-ready UI components, blocks, and layouts.',
        icon: LayoutGrid,
        color: '#00d4ff',
      },
      {
        title: '@gentleduck/primitives',
        href: '/duck-primitives',
        description: 'Accessible headless primitives for design systems.',
        icon: Box,
        color: '#a78bfa',
      },
      {
        title: '@gentleduck/cli',
        href: '/duck-cli',
        description: 'CLI for installing and generating UI assets.',
        icon: Terminal,
        color: '#4ade80',
      },
      {
        title: '@gentleduck/calendar',
        href: '/duck-calendar',
        description: 'Headless calendar engine with date adapters.',
        icon: Calendar,
        color: '#fb923c',
      },
      {
        title: '@gentleduck/hooks',
        href: '/duck-hooks',
        description: 'Reusable React hooks for UI workflows.',
        icon: Link2,
        color: '#38bdf8',
      },
      {
        title: '@gentleduck/variants',
        href: '/duck-variants',
        description: 'Type-safe variant builder for component APIs.',
        icon: Palette,
        color: '#f472b6',
      },
      {
        title: '@gentleduck/libs',
        href: '/duck-libs',
        description: 'Composable utility helpers for the ecosystem.',
        icon: Library,
        color: '#fbbf24',
      },
      {
        title: '@gentleduck/vim',
        href: '/duck-vim',
        description: 'Framework-agnostic keyboard command engine.',
        icon: Keyboard,
        color: '#f87171',
      },
      {
        title: '@gentleduck/motion',
        href: '/duck-motion',
        description: 'Enter/exit animations and mount/unmount transitions.',
        icon: Sparkles,
        color: '#c084fc',
      },
      {
        title: '@gentleduck/lazy',
        href: '/duck-lazy',
        description: 'Lazy-loading utilities for images and components.',
        icon: ImageIcon,
        color: '#2dd4bf',
      },
      {
        title: '@gentleduck/state',
        href: '/duck-state',
        description: 'Atom-based state management for React.',
        icon: Database,
        color: '#818cf8',
      },
      {
        title: '@gentleduck/shortcut',
        href: '/duck-shortcut',
        description: 'Keyboard shortcut hooks for power-user interfaces.',
        icon: Command,
        color: '#fb7185',
      },
      {
        title: '@gentleduck/ttlog',
        href: '/duck-ttlog',
        description: 'Structured, type-safe terminal logging with pluggable transports.',
        icon: ScrollText,
        color: '#f59e0b',
      },
      {
        title: '@gentleduck/upload',
        href: '/duck-upload',
        description: 'File upload engine with multipart, chunked, and presigned URL support.',
        icon: Upload,
        color: '#3b82f6',
      },
      {
        title: '@gentleduck/iam',
        href: '/duck-iam',
        description: 'Identity and access management — roles, permissions, and policy enforcement.',
        icon: KeyRound,
        color: '#ef4444',
      },
      {
        title: '@gentleduck/template',
        href: '/duck-template',
        description: 'Project and component scaffolding templates for the gentleduck ecosystem.',
        icon: FileCode2,
        color: '#8b5cf6',
      },
    ],
  },
  { href: '/skills', title: 'Skills' },
  { href: '/mcp', title: 'MCP' },
]
