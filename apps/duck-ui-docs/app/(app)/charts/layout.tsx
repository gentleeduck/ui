import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { ChartsNav } from '~/components/charts'
import { ActiveThemeProvider } from '~/components/colors'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { ThemesStyle } from '~/components/themes'
import { ThemesSwitcher } from '~/components/themes/themes-selector'

const title = 'Ready-to-Use Chart Components'
const description =
  'From bar and line charts to advanced visualizations, explore a collection of Recharts components you can drop straight into your projects.'

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

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <ActiveThemeProvider>
        <PageHeader className="relative">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 z-0 h-16 w-16 rounded-full bg-blue-400/20 blur-2xl md:h-72 md:w-72"></div>
          <div
            aria-hidden="true"
            className="absolute bottom-16 left-0 z-0 h-36 w-36 rounded-full bg-blue-400/20 blur-3xl"></div>
          <Announcement />
          <PageHeaderHeading>{title}</PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <a href="#charts">Browse Charts</a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/docs/components/chart">Documentation</Link>
            </Button>
          </PageActions>
        </PageHeader>
        <div className={'container-wrapper scroll-mt-24'} id="charts">
          <div className="container flex items-center justify-between gap-4 py-4">
            <ChartsNav />
          </div>
        </div>
        <div className="container-wrapper section-soft container flex-1">
          <div className="gap-6 md:flex md:flex-row-reverse md:items-start">
            <ThemesSwitcher className="fixed inset-x-0 bottom-0 z-40 flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:top-20 lg:bottom-auto" />
            <section className="theme-container w-full">
              <ThemesStyle />
              {children}
            </section>
          </div>
        </div>
      </ActiveThemeProvider>
    </div>
  )
}
