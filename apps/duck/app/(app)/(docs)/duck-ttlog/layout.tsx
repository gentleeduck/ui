import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck TTLog'
const description =
  'High-performance, low-allocation Rust logging framework. Lock-free ring buffer, compile-time macros, crash-safe snapshots.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-ttlog') },
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

export default function DuckTtlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
