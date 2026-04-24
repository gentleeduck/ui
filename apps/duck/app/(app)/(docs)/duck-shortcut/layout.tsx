import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { absoluteUrl } from '~/lib'

const title = 'Duck Shortcut'
const description =
  'Deprecated React keyboard shortcut hook — superseded by @gentleduck/vim. Still documented for existing users.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/duck-shortcut') },
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

export default function DuckShortcutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/shortcut',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://ui.gentleduck.org/duck-shortcut',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/deprecated/duck-shortcut',
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
            <Link href="/duck-shortcut/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-vim/introduction">Use duck-vim instead</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
