import { Metadata, Viewport } from 'next'
import { absoluteUrl } from '~/lib/utils'
import { siteConfig } from './site'
import { allTitles } from './docs'

export const VIEWPORT: Viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
}

export const METADATA: Metadata = {
  authors: [
    {
      name: 'wilddcuk2',
      url: 'https://github.com/wildduck2',
    },
  ],
  creator: 'wilddcuk2',
  description: siteConfig.description,
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
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
  alternates: {
    canonical: siteConfig.url,
  },
}

const ogImage = {
  url: siteConfig.ogImage,
  width: 1200,
  height: 630,
  alt: siteConfig.name,
}

export const SLUG_METADATA = (doc: { title: string; description: string; slug: string }): Metadata => ({
  ...METADATA,
  description: doc.description,
  openGraph: {
    ...METADATA.openGraph,
    title: doc.title,
    description: doc.description,
    type: 'article',
    url: absoluteUrl(doc.slug),
    images: [ogImage],
  },
  title: doc.title,
  twitter: {
    ...METADATA.twitter,
    title: doc.title,
    description: doc.description,
    images: [siteConfig.ogImage],
  },
})
