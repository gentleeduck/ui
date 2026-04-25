import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Shortcut'
const description =
  'Deprecated React keyboard shortcut hook — superseded by @gentleduck/vim. Still documented for existing users.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-shortcut') },
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

export default function DuckShortcutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
