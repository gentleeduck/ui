import { absoluteUrl } from '@gentleduck/docs/lib'
import type { Metadata, Viewport } from 'next'
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
      name: 'acme',
      url: 'https://github.com/acme',
    },
  ],
  creator: 'acme',
  description: siteConfig.description,
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
  },
  keywords: [
    'acme ui',
    'acme/ui',
    'acme ui react components',
    'acme ui button',
    'acme ui library',
    'acme ui components',
    'React UI library',
    'Tailwind CSS components',
    'Next.js UI components',
    'React Server Components',
    'TypeScript UI library',
    'Accessible React components',
    'Headless UI alternative',
    'Customizable UI components',
    'Lightweight React UI kit',
    'Type-safe React components',
    'React motion components',
    'React table library',
    'React form components',
    'Open source React UI library',
    'Best React UI frameworks',
    'Tailwind React component library',
    'Design system for React',
    'UI toolkit for developers',
  ],
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(
    siteConfig.url.startsWith('http') ? siteConfig.url : `https://${process.env.VERCEL_URL ?? 'localhost:3000'}`,
  ),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        url: `/og?title=${encodeURIComponent(siteConfig.name)}&description=${encodeURIComponent(siteConfig.title)}`,
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
    creator: '@acme',
    description: siteConfig.description,
    images: [
      {
        url: `/og?title=${encodeURIComponent(siteConfig.name)}&description=${encodeURIComponent(siteConfig.title)}`,
      },
    ],
    title: siteConfig.name,
  },
}

export const SLUG_METADATA = (doc: { title: string; description: string; slug: string }): Metadata => {
  const ogUrl = `/og?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description)}`
  return {
    ...METADATA,
    alternates: {
      canonical: absoluteUrl(doc.slug),
    },
    description: doc.description,
    openGraph: {
      ...METADATA.openGraph,
      description: doc.description,
      images: [{ url: ogUrl }],
      title: doc.title,
      type: 'article',
      url: absoluteUrl(doc.slug),
    },
    title: doc.title,
    twitter: {
      ...METADATA.twitter,
      description: doc.description,
      images: [{ url: ogUrl }],
      title: doc.title,
    },
  }
}
