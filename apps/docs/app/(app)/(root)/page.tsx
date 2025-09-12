import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Metadata } from 'next'
import Link from 'next/link'
import { Announcement } from '~/components/announcement'
import { CardsDemo } from '~/components/cards'
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/page-header'
import { ThemeWrapper } from '~/components/themes'

const title = 'Build Beautiful UIs with Simplicity and Power.'
const description = 'Bring life to your own website with a pack full of ideas made specially for magical websites.'

export const dynamic = 'force-static'
export const revalidate = false

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

export default function Page() {
  return (
    <>
      <PageHeader className="flex flex-col justify-center justify-self-center text-center">
        <Announcement />
        <PageHeaderHeading className="text-center w-full">{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions className="justify-center mx-auto w-full">
          <Button size="sm">
            <Link href="/docs/installation">Get Started</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Link href="/docs/components">What we have?</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-6">
          <section id="themes" className="scroll-mt-20">
            <ThemeWrapper>
              <CardsDemo />
            </ThemeWrapper>
          </section>
        </div>
      </div>
    </>
  )
}
