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
      name: 'wildduck2',
      url: 'https://github.com/wildduck2',
    },
  ],
  creator: 'wildduck2',
  description: siteConfig.description,
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
  },
  keywords: [
    // Organization
    'gentleduck',
    'gentleduck org',
    'gentleduck ecosystem',
    'gentleduck packages',

    // @gentleduck/ui
    'gentleduck/ui',
    'React UI library',
    'Tailwind CSS components',
    'styled React components',
    'shadcn alternative',
    'production-ready UI components',

    // @gentleduck/primitives
    'gentleduck/primitives',
    'headless UI components React',
    'accessible React primitives',
    'Radix alternative',
    'unstyled React components',

    // @gentleduck/cli
    'gentleduck/cli',
    'React UI CLI',
    'component scaffolding CLI',
    'install React components CLI',

    // @gentleduck/calendar
    'gentleduck/calendar',
    'React calendar component',
    'headless calendar engine',
    'React date picker',
    'react-day-picker alternative',
    'React Persian calendar',
    'React Hijri calendar',
    'date adapter pattern',

    // @gentleduck/variants
    'gentleduck/variants',
    'cva React',
    'type-safe component variants',
    'class variance authority alternative',

    // @gentleduck/vim
    'gentleduck/vim',
    'React keyboard shortcuts',
    'keyboard command engine',
    'vim keybindings React',

    // @gentleduck/motion
    'gentleduck/motion',
    'React animation library',
    'mount unmount transitions React',
    'reduced motion React',

    // @gentleduck/state
    'gentleduck/state',
    'React atom state management',
    'lightweight React state',

    // @gentleduck/hooks
    'gentleduck/hooks',
    'reusable React hooks',
    'React utility hooks',

    // @gentleduck/libs
    'gentleduck/libs',
    'React utility library',
    'cn utility TypeScript',

    // @gentleduck/lazy
    'gentleduck/lazy',
    'React lazy loading components',
    'deferred React components',

    // @gentleduck/shortcut
    'gentleduck/shortcut',
    'React keyboard shortcut hooks',
    'power-user React interface',

    // @gentleduck/ttlog
    'gentleduck/ttlog',
    'structured logging TypeScript',
    'type-safe terminal logger',
    'pluggable log transports',

    // @gentleduck/upload
    'gentleduck/upload',
    'file upload library TypeScript',
    'multipart upload JavaScript',
    'chunked file upload',
    'presigned URL upload',

    // @gentleduck/iam
    'gentleduck/iam',
    'identity access management TypeScript',
    'role based access control JavaScript',
    'RBAC TypeScript',
    'policy enforcement library',

    // @gentleduck/template
    'gentleduck/template',
    'project scaffolding templates',
    'component template generator',
    'monorepo starter template',

    // General developer intent
    'TypeScript UI library',
    'Next.js UI components',
    'React Server Components',
    'accessible React components',
    'open source React ecosystem',
    'design system for React',
    'UI toolkit for developers',
  ],
  manifest: `/site.webmanifest`,
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
    creator: '@gentleduck',
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
