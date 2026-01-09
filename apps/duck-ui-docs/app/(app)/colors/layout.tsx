import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { ColorsNav } from '~/components/colors'
import { ThemeWrapper } from '~/components/themes'

const title = 'Tailwind Colors, Simplified'
const description =
  'Browse the full Tailwind palette in HEX, RGB, HSL, and CSS formats. Copy and paste what you need in seconds.'

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

export default function ColorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <PageHeader className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 z-0 h-16 w-16 rounded-full bg-gray-400/20 blur-2xl md:h-72 md:w-72"></div>
        <div
          aria-hidden="true"
          className="absolute bottom-16 left-0 z-0 h-36 w-36 rounded-full bg-orange-400/20 blur-3xl"></div>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#colors">Browse Colors</a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="hidden">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between gap-8 py-4">
            <ColorsNav className="flex-1 overflow-hidden [&>a:first-child]:text-primary" />
          </div>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container py-6">
          <section className="scroll-mt-20" id="colors">
            <ThemeWrapper>{children}</ThemeWrapper>
          </section>
        </div>
      </div>
    </div>
  )
}
