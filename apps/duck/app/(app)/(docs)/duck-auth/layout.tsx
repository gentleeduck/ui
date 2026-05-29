import type { Metadata } from 'next'
import { absoluteUrl } from '~/lib'

const title = 'Duck Auth'
const description =
  'Faceted, framework-agnostic authentication for TypeScript. Password, magic-link, OAuth, passkey, API keys, SAML. Express, Hono, Next.js, Fastify, Koa, Elysia, NestJS, gRPC.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-auth') },
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

export default function DuckAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
