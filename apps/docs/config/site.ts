import { absoluteUrl } from '~/lib/utils'

export const siteConfig = {
  description:
    'Gentleduck Duck UI is a modern, open-source React component library built with Tailwind CSS. It offers accessible, customizable, and type-safe UI components to help developers build faster and more consistent interfaces.',
  links: {
    github: 'https://github.com/gentleduck/ui',
    twitter: 'https://x.com/wild_ducka',
  },
  name: 'duck/ui',
  ogImage: absoluteUrl('/og/root.png'),

  title: 'Duck UI – Modern React & Tailwind CSS Component Library',
  url: absoluteUrl('/'),
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  dark: '#09090b',
  light: '#ffffff',
}
