import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Query'
const description =
  'Typed Axios client. Pair it with a Duck Gen route map or supply your own. Bodies, params, queries, and responses are all typed.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-query') },
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

export default function DuckQueryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
