import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Libs'
const description =
  'Shared utilities for the gentleduck ecosystem. cn(), filteredObject, groupArray, parseDate. Each helper lives on its own subpath.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-libs') },
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

export default function DuckLibsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
