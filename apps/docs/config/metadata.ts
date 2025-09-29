import { Metadata, Viewport } from 'next'
import { absoluteUrl } from '~/lib/utils'
import { allTitles } from './docs'
import { siteConfig } from './site'

export const VIEWPORT: Viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
}

export const METADATA: Metadata = {
  alternates: {
    canonical: siteConfig.url,
  },
  authors: [
    {
      name: 'wilddcuk2',
      url: 'https://github.com/wildduck2',
    },
  ],
  creator: 'wilddcuk2',
  description: siteConfig.description,
  icons: {
    apple: [
      { media: '(prefers-color-scheme: light)', url: '/icons/light/apple-touch-icon.png' },
      { media: '(prefers-color-scheme: dark)', url: '/icons/dark/apple-touch-icon.png' },
    ],
    icon: [
      { media: '(prefers-color-scheme: light)', url: '/icons/light/favicon-32x32.png' },
      { media: '(prefers-color-scheme: dark)', url: '/icons/dark/favicon-32x32.png' },
    ],
    shortcut: [
      { media: '(prefers-color-scheme: light)', url: '/icons/light/favicon.ico' },
      { media: '(prefers-color-scheme: dark)', url: '/icons/dark/favicon.ico' },
    ],
  },
  keywords: [
    // Brand
    'gentleduck',
    'gentleduck duck ui',
    'gentleduck button',
    'Duck UI',
    ...allTitles.flatMap((title) => {
      const lower = title.toLowerCase()
      return [lower, `duck ${lower}`, `gentleduck ${lower}`, `${lower} component`]
    }),
    'Gentleduck',
    'Gentleduck Duck UI',

    // Core tech stack
    'React UI library',
    'Tailwind CSS components',
    'Next.js UI components',
    'React Server Components',
    'TypeScript UI library',

    // Feature-driven
    'Accessible React components',
    'Headless UI alternative',
    'Customizable UI components',
    'Lightweight React UI kit',
    'Type-safe React components',
    'React motion components',
    'React table library',
    'React form components',

    // Developer intent / search intent
    'Open source React UI library',
    'Best React UI frameworks',
    'Tailwind React component library',
    'Design system for React',
    'UI toolkit for developers',
  ],
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: siteConfig.name,
        height: 630,
        url: siteConfig.ogImage,
        width: 1200,
      },
    ],
    locale: 'en_US',
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: 'website',
    url: siteConfig.url,
  },
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@wild_ducka',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    title: siteConfig.name,
  },
}

const ogImage = {
  alt: siteConfig.name,
  height: 630,
  url: siteConfig.ogImage,
  width: 1200,
}

export const SLUG_METADATA = (doc: { title: string; description: string; slug: string }): Metadata => ({
  ...METADATA,
  description: doc.description,
  openGraph: {
    ...METADATA.openGraph,
    description: doc.description,
    images: [ogImage],
    title: doc.title,
    type: 'article',
    url: absoluteUrl(doc.slug),
  },
  title: doc.title,
  twitter: {
    ...METADATA.twitter,
    description: doc.description,
    images: [siteConfig.ogImage],
    title: doc.title,
  },
})
