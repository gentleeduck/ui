import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Primitives'
const description =
  'Headless, accessibility-first React primitives. Shared Slot, Presence, Popper, and focus-scope load once, so Alert Dialog ships at 1.6 KB and Popover at 2.4 KB.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-primitives') },
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

export default function DuckPrimitivesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
