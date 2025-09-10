import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'

import 'public/duck-ui/themes.css'
import { ThemeCustomizer, ThemeWrapper } from '~/components/themes'

const title = 'Pick a Color. Make it yours.'
const description = 'Try our hand-picked themes. Copy and paste them into your project. New theme editor coming soon.'

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

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader className="flex flex-col justify-center justify-self-center text-center">
        <Announcement />
        <PageHeaderHeading className="text-center w-full">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="justify-center mx-auto w-full">
          <Button size="sm">
            <a href="#themes">Browse Themes</a>
          </Button>
          <Button variant="ghost" size="sm">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div id="themes" className="scroll-mt-24">
        <div className="container-wrapper">
          <div className="container flex items-center">
            <ThemeCustomizer />
          </div>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container py-6">
          <section id="themes" className="scroll-mt-20">
            <ThemeWrapper>{children}</ThemeWrapper>
          </section>
        </div>
      </div>
    </>
  )
}
