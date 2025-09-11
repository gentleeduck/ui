import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { ChartsNav } from '~/components/charts'
import { ActiveThemeProvider } from '~/components/colors'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { ThemesStyle } from '~/components/themes'
import { ThemesSwitcher } from '~/components/themes/themes-selector'

const title = 'Beautiful Charts & Graphs'
const description =
  'A collection of ready-to-use chart components built with Recharts. From basic charts to rich data displays, copy and paste into your apps.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ActiveThemeProvider>
        <PageHeader>
          <Announcement />
          <PageHeaderHeading>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <a href="#charts">Browse Charts</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs/components/chart">Documentation</Link>
            </Button>
          </PageActions>
        </PageHeader>
        <div className={'container-wrapper scroll-mt-24'} id="charts">
          <div className="container flex items-center justify-between gap-4 py-4">
            <ChartsNav />
          </div>
        </div>
        <div className="container-wrapper container section-soft flex-1">
          <div className="gap-6 md:flex md:flex-row-reverse md:items-start">
            <ThemesSwitcher className="fixed inset-x-0 bottom-0 z-40 flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:bottom-auto lg:top-20" />
            <section className="theme-container w-full">
              <ThemesStyle />
              {children}
            </section>
          </div>
        </div>
      </ActiveThemeProvider>
    </>
  )
}
