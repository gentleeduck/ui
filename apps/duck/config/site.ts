import { absoluteUrl } from '~/lib'

export const siteConfig = {
  author: {
    name: 'Ahmed Ayob',
    url: 'https://x.com/wild_ducka',
    email: 'ahmedayobbusiness@gmail.com',
  },
  description:
    'The gentleduck ecosystem — UI components, headless primitives, a CLI, calendar engine, file uploads, structured logging, identity & access management, and project templates. Framework-agnostic, type-safe, and production-ready.',
  links: {
    community: 'community@gentleduck.org',
    discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://discord.gg/r93Qvam8',
    email: 'support@gentleduck.org',
    github: 'https://github.com/gentleeduck/gentleduck',
    security: 'security@gentleduck.org',
    sponsor: process.env.NEXT_PUBLIC_SPONSOR_URL ?? 'https://opencollective.com/gentelduck',
    twitter: 'https://x.com/wild_ducka',
  },
  name: 'gentleduck',
  ogImage: absoluteUrl('/og/root.png'),
  title: 'the ecosystem that ships with everything',
  url: absoluteUrl('/'),
  metaThemeColors: {
    dark: '#09090b',
    light: '#ffffff',
  },
  packages: [
    { name: '@gentleduck/ui', href: '/duck-ui', description: 'Production-ready styled components and blocks.' },
    { name: '@gentleduck/primitives', href: '/duck-primitives', description: 'Accessible headless primitives.' },
    { name: '@gentleduck/cli', href: '/duck-cli', description: 'CLI for scaffolding and installing assets.' },
    {
      name: '@gentleduck/calendar',
      href: '/duck-calendar',
      description: 'Headless calendar engine with date adapters.',
    },
    { name: '@gentleduck/variants', href: '/duck-variants', description: 'Type-safe cva() variant system.' },
    { name: '@gentleduck/vim', href: '/duck-vim', description: 'Keyboard command engine for React.' },
    {
      name: '@gentleduck/motion',
      href: '/duck-motion',
      description: 'Animation tokens and mount/unmount transitions.',
    },
    { name: '@gentleduck/state', href: '/duck-state', description: 'Atom-based state management.' },
    { name: '@gentleduck/hooks', href: '/duck-hooks', description: 'Reusable React utility hooks.' },
    { name: '@gentleduck/libs', href: '/duck-libs', description: 'Composable utility helpers.' },
    { name: '@gentleduck/lazy', href: '/duck-lazy', description: 'Lazy-loading for images and components.' },
    { name: '@gentleduck/shortcut', href: '/duck-shortcut', description: 'Keyboard shortcut hooks.' },
    {
      name: '@gentleduck/ttlog',
      href: '/duck-ttlog',
      description: 'Structured, type-safe terminal logging with pluggable transports.',
    },
    {
      name: '@gentleduck/upload',
      href: '/duck-upload',
      description: 'Framework-agnostic file upload engine with multipart, chunked, and presigned URL support.',
    },
    {
      name: '@gentleduck/iam',
      href: '/duck-iam',
      description: 'Identity and access management — roles, permissions, and policy enforcement.',
    },
    {
      name: '@gentleduck/template',
      href: '/duck-template',
      description: 'Project and component scaffolding templates for the gentleduck ecosystem.',
    },
  ],
}

export type SiteConfig = typeof siteConfig
