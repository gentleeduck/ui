import { PageActions, PageHeader, PageHeaderDescription } from '@gentleduck/docs/client'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { FeaturesSection } from '~/components/layouts/features'

const title = 'Turn Tiny Primitives into Infinite Design'
const description =
  'A modern, open-source React component library built on Tailwind CSS. Accessible, customizable, and type-safe primitives for building beautiful interfaces.'

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
        <div className="relative">
          <h1 className="inline-block max-w-6xl font-bold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <div className="relative mb-3 text-center text-4xl sm:text-5xl md:mb-5 md:text-6xl">
              <span className="inline-block">TURN TINY PRIMITIVES INTO</span>
            </div>
            <div className="mt-1 block text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="relative inline-block -rotate-3 bg-primary px-4 py-1 text-primary-foreground">
                INFINITE
              </span>
              <span className="ml-2 inline-block text-foreground uppercase">Design</span>
            </div>
          </h1>
        </div>
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
        </div>
      </div>
    </>
  )
}
