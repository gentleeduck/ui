import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { absoluteUrl } from '@gentleduck/docs/lib'
import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { BlocksNav } from '~/components/blocks/block-nav'

const title = 'Building Blocks for Modern Apps'
const description =
  'Pre-built, composable UI blocks you can drop into any React project. Ship complete features in minutes.'

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/blocks'),
  },
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  title,
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function BlocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 z-0 h-16 w-16 rounded-full bg-rose-400/20 blur-2xl md:h-72 md:w-72"></div>
        <div
          aria-hidden="true"
          className="absolute bottom-16 left-0 z-0 h-36 w-36 rounded-full bg-red-400/20 blur-3xl"></div>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#blocks">Browse Blocks</a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/docs/blocks">Add a block</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className={'container-wrapper scroll-mt-24'} id="charts">
        <div className="container flex items-center justify-between gap-4 py-4">
          <BlocksNav />
          <Button asChild className="mr-7 hidden shadow-none lg:flex" size="sm" variant="secondary">
            <Link href="/blocks">Browse all blocks</Link>
          </Button>
        </div>
      </div>
      <div className="container-wrapper section-soft flex-1 md:py-12">
        <div className="container">{children}</div>
      </div>
    </div>
  )
}
