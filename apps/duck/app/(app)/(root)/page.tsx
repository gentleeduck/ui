import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { FeaturesSection } from '~/components/layouts/features-section'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

const title = 'The Open-Source Stack for Teams That Ship'
const description =
  'From headless UI and state atoms to auth, uploads, keyboard bindings, and structured logging — gentleduck covers every layer. Type-safe, composable, framework-agnostic.'

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
    <div className="overflow-hidden">
      <PageHeader className="iv]:h-screen relative flex w-full flex-col justify-start justify-self-center text-center [&>div>">
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="mx-auto w-full justify-center">
          <Button asChild>
            <Link href="/www/installation">Get Started</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/www/packages">Explore Packages</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <FeaturesSection />
      <OpenSourceSection />
    </div>
  )
}
