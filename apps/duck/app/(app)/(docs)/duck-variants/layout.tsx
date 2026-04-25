import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Variants'
const description =
  'Type-safe variant system with cva(). Compound variants, default variants, and a VariantProps helper, all inferred from your config.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-variants') },
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

export default function DuckVariantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
