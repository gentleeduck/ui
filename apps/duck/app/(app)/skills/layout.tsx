import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { absoluteUrl } from '@gentleduck/docs/lib'
import type { Metadata } from 'next'

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
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
