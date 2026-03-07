import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { Button } from '@gentleduck/registry-ui/button'
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
    <div className="overflow-hidden">
      <PageHeader className="relative flex flex-col justify-start w-full justify-self-center text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 z-0 h-[14rem] w-[14rem] rounded-full bg-gradient-to-br from-yellow-400/15 to-orange-400/10 blur-[100px] md:h-[20rem] md:w-[20rem]"></div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 -left-40 z-0 h-[12rem] w-[12rem] rounded-full bg-gradient-to-tr from-primary/12 to-sky-400/8 blur-[90px] md:h-[18rem] md:w-[18rem]"></div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/2 z-0 h-[10rem] w-[10rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/8 to-fuchsia-400/5 blur-[110px] md:h-[16rem] md:w-[16rem]"></div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -bottom-32 z-0 h-[8rem] w-[8rem] rounded-full bg-gradient-to-tl from-rose-400/6 to-pink-300/4 blur-[80px] md:h-[14rem] md:w-[14rem]"></div>
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
        <FeaturesSection />
        <SponsorsSection />
      </div>
    </div>
  )
}
