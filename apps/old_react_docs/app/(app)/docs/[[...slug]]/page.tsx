import { notFound } from 'next/navigation'
import { allDocs } from 'contentlayer/generated'

import '~/styles/mdx.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, ExternalLinkIcon } from '@radix-ui/react-icons'
import Balancer from 'react-wrap-balancer'

import { siteConfig } from '~/config/site'
import { getTableOfContents } from '~/lib/toc'
import { Mdx } from '~/components/mdx-components'
import { DocsPager } from '~/components/pager'
import { DashboardTableOfContents } from '~/components/toc'
import { ScrollArea } from '../../../../../../packages/_oldstuff_refactor/ui/scroll-area'
import { badgeVariants } from '@gentleduck/registry-ui-duckui/badge'
import { absoluteUrl } from '~/lib/utils'
import { cn } from '@gentleduck/libs/cn'

interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join('/') || ''
  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const params = await props.params
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [siteConfig.ogImage],
      creator: '@wildduck',
    },
  }
}

export async function generateStaticParams(): Promise<DocPageProps['params'][]> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split('/'),
  }))
}

export default async function DocPage(props: DocPageProps) {
  const params = await props.params

  const doc = await getDocFromParams({ params })
  if (!doc) {
    notFound()
  }

  const toc = await getTableOfContents(doc.body.raw)

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
          <div className="truncate">Docs</div>
          <ChevronRightIcon className="h-3.5 w-3.5" />
          <div className="text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn('scroll-m-20 text-3xl font-bold tracking-tight')}>{doc.title}</h1>
          {doc.description && (
            <p className="text-base text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        {doc.links ? (
          <div className="flex items-center space-x-2 pt-4">
            {doc.links?.doc && (
              <Link
                href={doc.links.doc}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}>
                Docs
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
            {doc.links?.api && (
              <Link
                href={doc.links.api}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}>
                API Reference
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : null}
        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>
        <DocsPager doc={doc} />
      </div>
      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={toc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  )
}
