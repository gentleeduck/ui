import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { FeaturesSection } from '~/components/layouts/features'
import { SponsorsSection } from '~/components/layouts/sponsors'

const title = 'The React UI Ecosystem That Ships With Everything'
const description =
  'Headless primitives, styled components, a CLI, and pre-built blocks. Type-safe, accessible, and built on Tailwind CSS.'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
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

export default function Page() {
  return (
    <>
      <PageHeader className="relative flex flex-col justify-start justify-self-center text-center">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 z-0 h-16 w-16 rounded-full bg-yellow-400/20 blur-2xl md:h-72 md:w-72"></div>
        <div
          aria-hidden="true"
          className="absolute bottom-16 left-0 z-0 h-36 w-36 rounded-full bg-primary/20 blur-3xl"></div>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="mx-auto w-full justify-center">
          <Button asChild>
            <Link href="/docs/installation">Get Started</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/docs/components">What we have?</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper">
        <div className="">
          <FeaturesSection />
          <SponsorsSection />
        </div>
      </div>
    </>
  )
}
