import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Template'
const description =
  'Rust-powered project scaffolder. JSON-driven templates with variants, remote configs, and flag injection.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-template') },
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

export default function DuckTemplateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
