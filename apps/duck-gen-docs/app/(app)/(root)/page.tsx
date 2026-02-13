import { PageActions, PageHeader, PageHeaderDescription } from '@gentleduck/docs/client'
import { DuckLazyComponent } from '@gentleduck/lazy/lazy-component'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { EcosystemSection } from '~/components/layouts/core-packages'
import { FeaturesSection } from '~/components/layouts/features'

const title = 'Duck Gen — Contracts that compile, APIs that stay in sync.'
const description =
  'Duck Gen is a general-purpose compiler extension that scans controllers and message tags to keep your API and i18n types aligned'

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
              <span className="inline-block">DUCK GEN</span>
            </div>
            <div className="mt-1 block text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="relative inline-block -rotate-3 bg-primary px-4 py-1 text-primary-foreground">
                COMPILE-TIME
              </span>
              <span className="ml-2 inline-block text-foreground uppercase">CONTRACTS</span>
            </div>
          </h1>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="mx-auto w-full justify-center">
          <Button>
            <Link href="/docs/duck-gen">Get Started</Link>
          </Button>
          <Button variant="ghost">
            <Link href="/docs/duck-gen/api-routes">API Routes</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper">
        <div>
          <FeaturesSection />
          <DuckLazyComponent options={{ rootMargin: '-50px 0px 0px 0px', threshold: 0 }}>
            <EcosystemSection />
          </DuckLazyComponent>
        </div>
      </div>
    </>
  )
}
