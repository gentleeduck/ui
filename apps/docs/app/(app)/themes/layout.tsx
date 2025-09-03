import { Metadata } from 'next'
import Link from 'next/link'

import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Announcement } from '~/components/announcement'

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
    <div>
      <PageHeader className="flex flex-col justify-center justify-self-center text-center">
        <Announcement />
        <PageHeaderHeading className="text-center w-full">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="justify-center mx-auto w-full">
          <Button size="sm">
            <a href="#colors">Browse Colors</a>
          </Button>
          <Button variant="ghost" size="sm">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      {children}
    </div>
  )
}
