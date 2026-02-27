import { absoluteUrl } from '@gentleduck/docs/lib'

export const siteConfig = {
  author: {
    name: 'Ahmed Ayob',
    url: 'https://x.com/wild_ducka',
    email: 'support@gentleduck.org',
  },
  description:
    'A modern, open-source React component library built on Tailwind CSS. Accessible, customizable, and type-safe primitives for building beautiful interfaces.',
  links: {
    email: 'duckui@duck.com',
    github: 'https://github.com/gentleeduck/duck-ui',
    twitter: 'https://x.com/wild_ducka',
  },
  name: 'gentleduck/ui',
  ogImage: absoluteUrl('/og/root.png'),
  title: 'turn tiny primitives to infinite design',
  url: absoluteUrl('/'),
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  dark: '#09090b',
  light: '#ffffff',
}
