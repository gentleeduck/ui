import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@gentleduck/docs/client'
import { absoluteUrl } from '@gentleduck/docs/lib'
import type { Metadata } from 'next'

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
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-8">{children}</div>
      </div>
    </div>
  )
}
