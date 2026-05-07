import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { absoluteUrl } from '~/lib'

const title = 'Agent Skills'
const description =
  'Pre-built skills for AI coding assistants — drop gentleduck skills into your Claude, Cursor, or Copilot setup.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/skills') },
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

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="https://github.com/gentleeduck/gentleduck/tree/master/skills" target="_blank" rel="noreferrer">
              Browse on GitHub
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/www/skills">Get Started</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
