import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck CLI'
const description =
  'Command-line tool for scaffolding projects and installing gentleduck/ui components. Five commands: init, add, update, diff, list.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-cli') },
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

export default function DuckCliLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
