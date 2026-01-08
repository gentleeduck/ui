import { Button } from '@gentleduck/registry-ui-duckui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs'

import { ThemeCustomizer, ThemeWrapper } from '~/components/themes'

const title = 'Find Your Color. Make It Yours.'
const description = 'Browse hand-crafted themes you can use right away. Just copy and paste. Theme editor coming soon!'

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

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
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
        <PageHeaderHeading className="w-full text-center">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="mx-auto w-full justify-center">
          <Button size="sm">
            <a href="#themes">Browse Themes</a>
          </Button>
          <Button size="sm" variant="ghost">
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
          <section className="relative z-50 scroll-mt-20" id="themes">
            <ThemeWrapper>{children}</ThemeWrapper>
          </section>
        </div>
      </div>
    </div>
  )
}
