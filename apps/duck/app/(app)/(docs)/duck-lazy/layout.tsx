import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Lazy'
const description =
  'Lazy-loading components and images for React. Built on IntersectionObserver. SSR-safe. Zero dependencies.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-lazy') },
  description,
  title,
  openGraph: {
    title,
    description,
    images: [{ url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}` }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}` }],
  },
}

export default function DuckLazyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
