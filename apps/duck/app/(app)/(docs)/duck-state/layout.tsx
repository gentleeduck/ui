import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck State'
const description =
  'Atom-based state management for React — Jotai-inspired primitives, auto dependency tracking, derived atoms, and a standalone store.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-state') },
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

export default function DuckStateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
