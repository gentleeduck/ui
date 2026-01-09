import { DashboardTableOfContents, DocsCopyPage, DocsPagerBottom, DocsPagerTop, Mdx } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { badgeVariants } from '@gentleduck/registry-ui-duckui/badge'
import { ExternalLinkIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
// import { DocCopy } from '~/components/ui/Blocks/doc-copy'
import { SLUG_METADATA } from '~/config/metadata'
import { docs } from '../../../../.velite'

interface DocPageProps {
  params: {
    slug: string[]
  }
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug
  const doc = docs.find((doc) => slug?.includes(doc.permalink))

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await props.params
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }
  return SLUG_METADATA(doc)
}

const PostLayout = async ({ params }: { params: Promise<{ slug: any }> }) => {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const _params = await params
  const path = _params.slug ? '/' + _params.slug.join('/') : '/'

  const fullUrl = `${protocol}://${host}/docs${path}`

  const doc = docs.find((post) => {
    if (post?.slug === 'docs/index' && !_params.slug) {
      return true
    }

    if (post.slug.endsWith('/index')) {
      return String(fullUrl + '/index').endsWith(post.slug)
    } else {
      return fullUrl.endsWith(post.slug)
    }
  })

  if (!doc) {
    notFound()
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0 max-w-2xl" style={{ contain: 'paint' }}>
        <div className="space-y-2">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            {
              // <DocsCopyPage page={doc.content} url={absoluteUrl('')} />
            }
            <DocsPagerTop doc={doc} />
          </div>
          <div className="space-y-2">
            <h1 className={cn('scroll-m-20 font-bold text-3xl capitalize tracking-tight')}>
              {doc.title.split('-').join(' ')}
            </h1>
            {doc.description && <p className="text-base text-muted-foreground">{doc.description}</p>}
          </div>
        </div>
        {doc.links ? (
          <div className="flex items-center space-x-2 pt-4">
            {doc.links?.doc && (
              <Link
                className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
                href={doc.links.doc}
                rel="noreferrer"
                target="_blank">
                Docs
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
            {doc.links?.api && (
              <Link
                className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
                href={doc.links.api}
                rel="noreferrer"
                target="_blank">
                API Reference
                <ExternalLinkIcon className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : null}
        <div className="pt-8 pb-12">
          <Mdx code={doc.body} />
        </div>
        {<DocsPagerBottom doc={doc} />}
      </div>
      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <div className="show-scroll-hover sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pb-10">
              <DashboardTableOfContents toc={doc.toc} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default PostLayout
