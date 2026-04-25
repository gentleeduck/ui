import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Calendar'
const description =
  'Headless calendar engine. Ships Gregorian, Islamic, Persian, and Hebrew systems, seven date adapters, full keyboard and ARIA support. ~5 KB gzipped.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-calendar') },
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

export default function DuckCalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
