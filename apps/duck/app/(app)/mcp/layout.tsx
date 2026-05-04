import { Button } from '@gentleduck/registry-ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { absoluteUrl } from '~/lib'

const title = 'MCP Server'
const description =
  'Model Context Protocol server for gentleduck/ui — use your component library directly from AI coding assistants.'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/mcp') },
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

export default function McpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>

        <PageHeaderDescription>{description}</PageHeaderDescription>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/www/mcp">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://gentleduck.org/api/mcp" target="_blank" rel="noreferrer">
              View Server
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
