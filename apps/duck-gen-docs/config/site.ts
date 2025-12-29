import { absoluteUrl } from '~/lib/utils'

export const siteConfig = {
  description:
    '@gentleduck/gen generates type-safe API routes and message keys for NestJS projects. It keeps server contracts and client types aligned with zero manual syncing.',
  links: {
    github: 'https://github.com/gentleeduck/duck-ui',
    twitter: 'https://x.com/wild_ducka',
  },
  name: 'gentleduck/gen',
  ogImage: absoluteUrl('/og/root.png'),
  title: 'duck gen — type-safe nestjs contracts',
  url: absoluteUrl('/'),
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  dark: '#09090b',
  light: '#ffffff',
}
