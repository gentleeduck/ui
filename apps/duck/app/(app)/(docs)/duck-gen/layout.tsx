import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Gen'
const description =
  'Scans your TypeScript server code and emits .d.ts files so client types stay locked to your backend routes and message keys.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-gen') },
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

export default function DuckGenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
