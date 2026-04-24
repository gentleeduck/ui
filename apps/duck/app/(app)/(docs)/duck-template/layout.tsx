import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { absoluteUrl } from '~/lib'

const title = 'Duck Template'
const description =
  'Rust-powered project scaffolder. JSON-driven templates with variants, remote configs, and flag injection.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-template') },
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

export default function DuckTemplateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-template/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://github.com/gentleeduck/duck-template" target="_blank" rel="noreferrer">
              View Source
            </Link>
          </Button>
        </div>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
