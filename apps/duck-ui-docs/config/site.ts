import { absoluteUrl } from '@gentleduck/docs/lib'

export const siteConfig = {
  author: {
    name: 'Ahmed Ayob',
    url: 'https://x.com/wild_ducka',
    email: 'ahmedayobbusiness@gmail.com',
  },
  description:
    'Headless primitives, styled components, a CLI, and pre-built blocks. Type-safe, accessible, and built on Tailwind CSS.',
  links: {
    community: 'community@gentleduck.org',
    discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://discord.gg/r93Qvam8',
    email: 'support@gentleduck.org',
    github: 'https://github.com/gentleeduck/duck-ui',
    security: 'security@gentleduck.org',
    sponsor: process.env.NEXT_PUBLIC_SPONSOR_URL ?? 'https://opencollective.com/gentelduck',
    twitter: 'https://x.com/wild_ducka',
  },
  name: 'gentleduck/ui',
  ogImage: absoluteUrl('/og/root.png'),
  title: 'the react ui ecosystem that ships with everything',
  url: absoluteUrl('/'),
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  dark: '#09090b',
  light: '#ffffff',
}
