import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'gentleduck'
const description =
  'Editorial pages, project notes, and news posts for the gentleduck organization. Independent of any single package.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/www') },
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

export default function WwwLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
