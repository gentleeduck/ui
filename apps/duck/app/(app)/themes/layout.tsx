import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { ThemeCustomizer, ThemeWrapper } from '~/components/themes'
import { absoluteUrl } from '~/lib'

const title = 'Make It Yours With Themes'
const description =
  'Hand-crafted color themes for gentleduck/ui. Browse, preview, and copy the config straight into your project.'

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl('/themes'),
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

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader className="relative">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 z-0 h-16 w-16 rounded-full bg-gray-400/20 blur-2xl md:h-72 md:w-72"></div>
        <div
          aria-hidden="true"
          className="absolute bottom-16 left-0 z-0 h-36 w-36 rounded-full bg-orange-400/20 blur-3xl"></div>
        <Announcement />
        <PageHeaderHeading className="w-full text-center">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="mx-auto w-full justify-center">
          <Button asChild size="sm">
            <a href="#themes">Browse Themes</a>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="scroll-mt-24" id="themes">
        <div className="container-wrapper">
          <div className="container flex items-center">
            <ThemeCustomizer />
          </div>
        </div>
      </div>
      <div className="container-wrapper bg-background">
        <div className="container py-6">
          <section className="relative scroll-mt-20">
            <ThemeWrapper>{children}</ThemeWrapper>
          </section>
        </div>
      </div>
    </div>
  )
}
