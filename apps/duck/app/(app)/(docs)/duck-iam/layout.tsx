import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck IAM'
const description =
  'ABAC + RBAC access control engine. Server adapters for Express, NestJS, Hono, and Next.js. Client bindings for React and Vue.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-iam') },
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

export default function DuckIamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
