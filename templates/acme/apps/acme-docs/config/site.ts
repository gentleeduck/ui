import { absoluteUrl } from '@gentleduck/docs/lib'

export const siteConfig = {
  author: {
    name: 'Acme',
    url: 'https://acme.com',
    email: 'hello@acme.com',
  },
  description:
    'Headless primitives, styled components, a CLI, and pre-built blocks. Type-safe, accessible, and built on Tailwind CSS.',
  links: {
    community: 'community@acme.com',
    discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://discord.gg/acme',
    email: 'support@acme.com',
    github: 'https://github.com/acme/acme-ui',
    security: 'security@acme.com',
    sponsor: process.env.NEXT_PUBLIC_SPONSOR_URL ?? 'https://opencollective.com/acme',
    twitter: 'https://x.com/acme',
  },
  name: 'acme/ui',
  ogImage: absoluteUrl('/og/root.png'),
  title: 'the react ui ecosystem that ships with everything',
  url: absoluteUrl('/'),
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  dark: '#09090b',
  light: '#ffffff',
}
