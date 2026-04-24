import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { absoluteUrl } from '~/lib'

const title = 'Duck Primitives'
const description =
  'Headless, accessibility-first React primitives. Shared Slot, Presence, Popper, and focus-scope load once, so Alert Dialog ships at 1.6 KB and Popover at 2.4 KB.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-primitives') },
  description,
  title,
  openGraph: {
    title,
    description,
    images: [{ url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}` }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}` }],
  },
}

export default function DuckPrimitivesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/primitives',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-primitives',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-primitives',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-primitives/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-primitives/api/dialog">API Reference</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
