import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck TType'
const description =
  'Compile-time type testing plus 200+ TypeScript utility types. Primitives, predicates, tuples, brands, and more.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-ttest') },
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

export default function DuckTtestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
