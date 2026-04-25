import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Vim'
const description =
  'Typed keyboard command engine for React. Hotkey parser, sequence matcher, chord bindings, key recorder, and platform-aware `Mod`.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-vim') },
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

export default function DuckVimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
