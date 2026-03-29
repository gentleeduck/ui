import {
  DashboardTableOfContents,
  DocsCopyPage,
  DocsPagerBottom,
  DocsPagerTop,
  DocsPathBreadcrumb,
  Mdx,
} from '@gentleduck/docs/client'
import { absoluteUrl } from '@gentleduck/docs/lib'
import { cn } from '@gentleduck/libs/cn'
import { badgeVariants } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Separator } from '@gentleduck/registry-ui/separator'
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon, SquareArrowOutUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SLUG_METADATA } from '~/config/metadata'
import { docs } from '../../../../.velite'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

function getDocFromSlug(slug?: string[]) {
  const path = slug && slug.length > 0 ? slug.join('/') : 'index'
  const normalizedPath = path.replace(/^\/+|\/+$/g, '')
  const candidates = normalizedPath === 'index' ? ['index'] : [normalizedPath, `${normalizedPath}/index`]

  return docs.find((doc) => candidates.includes(doc.permalink)) ?? null
}

export async function generateStaticParams() {
  const unique = new Map<string, string[]>()

  for (const doc of docs) {
    const permalink = doc.permalink.replace(/^\/+|\/+$/g, '')

    if (permalink === 'index') {
      unique.set('', [])
      continue
    }

    const cleanPath = permalink.endsWith('/index') ? permalink.slice(0, -'/index'.length) : permalink
    unique.set(cleanPath, cleanPath.split('/'))
  }

  return Array.from(unique.values()).map((slug) => ({ slug }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await props.params
  const doc = getDocFromSlug(params.slug)

  if (!doc) {
    return {}
  }
  return SLUG_METADATA(doc)
}

const PostLayout = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const _params = await params
  const doc = getDocFromSlug(_params.slug)

  if (!doc) {
    notFound()
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]" id="top">
      <div className="relative mx-auto w-full min-w-0 max-w-2xl">
        <div className="mb-4 flex h-8 items-center gap-4">
          <div className="min-w-0 flex-1">
            <DocsPathBreadcrumb segments={_params.slug ?? []} />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <DocsCopyPage page={doc.content} url={absoluteUrl(doc.slug)} />
            <DocsPagerTop doc={doc} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="space-y-2">
            <h1 className={cn('scroll-m-20 font-bold text-2xl capitalize tracking-tight sm:text-3xl')}>
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
                <ExternalLinkIcon aria-hidden="true" className="h-3 w-3" />
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            )}
            {doc.links?.api && (
              <Link
                className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
                href={doc.links.api}
                rel="noreferrer"
                target="_blank">
                API Reference
                <ExternalLinkIcon aria-hidden="true" className="h-3 w-3" />
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            )}
          </div>
        ) : null}
        <div className="pt-8 pb-12">
          <Mdx code={doc.body} />
        </div>
        {<DocsPagerBottom doc={doc} />}
        <div aria-hidden="true" id="bottom" />
      </div>
      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 flex h-[calc(100vh-3.5rem)] flex-col py-12">
            <DashboardTableOfContents toc={doc.toc} />
            <Separator className="my-4 shrink-0" />
            <div className="flex shrink-0 flex-col gap-1">
              <Button asChild className="justify-start" size="sm" variant="link">
                <a
                  href={`https://github.com/gentleeduck/duck-ui/blob/master/apps/duck-ui-docs/content/${doc.slug}.mdx`}
                  rel="noreferrer"
                  target="_blank">
                  <SquareArrowOutUpRight aria-hidden="true" className="size-3.5" />
                  Edit this page on GitHub
                </a>
              </Button>
              <Button asChild className="justify-start" size="sm" variant="link">
                <a href="#top">
                  <ArrowUpIcon aria-hidden="true" className="size-3.5" />
                  Scroll to top
                </a>
              </Button>
              <Button asChild className="justify-start" size="sm" variant="link">
                <a href="#bottom">
                  <ArrowDownIcon aria-hidden="true" className="size-3.5" />
                  Scroll to bottom
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default PostLayout
