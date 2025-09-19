import { Metadata, Viewport } from 'next'
import { Docs } from '~/.velite'
import { absoluteUrl } from '~/lib/utils'
import { siteConfig } from './site'

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
    apple: '/apple-touch-icon.png',
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
  },
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Server Components', 'Radix UI'],
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

export const VIEWPORT: Viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
}

export const SLUG_METADATA = (doc: Docs) => ({
  description: doc.description,
  openGraph: {
    description: doc.description,
    images: [
      {
        alt: siteConfig.name,
        height: 630,
        url: siteConfig.ogImage,
        width: 1200,
      },
    ],
    title: doc.title,
    type: 'article',
    url: absoluteUrl(doc.slug),
  },
  title: doc.title,
  twitter: {
    card: 'summary_large_image',
    creator: '@wildduck',
    description: doc.description,
    images: [siteConfig.ogImage],
    title: doc.title,
  },
})
