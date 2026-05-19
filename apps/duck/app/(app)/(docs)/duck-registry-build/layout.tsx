import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Registry Build'
const description =
  'Extension-driven build system for component registries. Configurable pipeline, typed sources, and a UI preset ready to use.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-registry-build') },
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

export default function DuckRegistryBuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
