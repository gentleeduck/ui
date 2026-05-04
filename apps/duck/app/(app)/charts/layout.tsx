import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { ChartsNav } from '~/components/charts'
import { ActiveThemeProvider } from '~/components/colors'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { ThemesStyle } from '~/components/themes'
import { ThemesSwitcher } from '~/components/themes/themes-selector'
import { absoluteUrl } from '~/lib'

const title = 'Charts, Rebuilt From the Ground Up'
const description =
  'A brand-new version of our chart components. Built on Recharts, responsive, themeable, and ready to drop into any project.'

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/charts'),
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

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
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
              <Link href="/duck-ui/components/chart">Documentation</Link>
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
            <ThemesSwitcher className="fixed inset-x-0 bottom-0 z-40 flex bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 lg:sticky lg:top-20 lg:bottom-auto" />
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
