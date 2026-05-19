import {
  DashboardTableOfContents,
  DocsCopyPage,
  DocsPagerBottom,
  DocsPagerTop,
  DocsPathBreadcrumb,
  DocsSidebarNav,
  Mdx,
} from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Separator } from '@gentleduck/registry-ui/separator'
import { ArrowDownIcon, ArrowUpIcon, SquareArrowOutUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SLUG_METADATA } from '~/config/metadata'
import { wwwSidebar } from '~/config/sidebars'
import { absoluteUrl } from '~/lib'
import { www } from '../../../../../.gentleduck'

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

const PKG_PREFIX = 'www'

const sidebar = wwwSidebar

function getDocFromSlug(slug?: string[]) {
  const path = slug && slug.length > 0 ? slug.join('/') : 'index'
  const candidates = [`${PKG_PREFIX}/${path}`, `${PKG_PREFIX}/${path}/index`]
  return www.find((doc) => candidates.includes(doc.permalink)) ?? null
}

export async function generateStaticParams() {
  return www.map((doc) => {
    const rest = doc.permalink.slice(PKG_PREFIX.length + 1).replace(/\/index$/, '')
    return { slug: rest ? rest.split('/') : [] }
  })
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params
  const doc = getDocFromSlug(params.slug)
  if (!doc) return {}

  const base = SLUG_METADATA(doc)
  const slugPath = params.slug && params.slug.length > 0 ? `/${params.slug.join('/')}` : ''
  return {
    ...base,
    alternates: {
      canonical: absoluteUrl(`/${PKG_PREFIX}${slugPath}`),
    },
    openGraph: {
      ...base.openGraph,
      url: absoluteUrl(`/${PKG_PREFIX}${slugPath}`),
    },
  }
}

const WwwPage = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const _params = await params
  const slug = _params.slug ?? []
  const doc = getDocFromSlug(slug)

  if (!doc) {
    notFound()
  }

  const sourcePath = doc.permalink.endsWith('/index')
    ? `${doc.permalink.slice(0, -'/index'.length)}/index.mdx`
    : `${doc.permalink}.mdx`

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[270px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
      <aside
        aria-label="Documentation sidebar"
        className="hidden shrink-0 border-grid border-r md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)]">
        <nav aria-label="gentleduck sections" className="h-full overflow-y-auto overflow-x-hidden pt-10 pb-8">
          <DocsSidebarNav config={sidebar} />
        </nav>
      </aside>
      <main className="relative py-6 pr-4 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]" id="top">
        <article className="relative mx-auto mt-20 w-full min-w-0 max-w-2xl">
          <header className="space-y-4">
            <div className="flex h-8 items-center gap-4">
              <div className="min-w-0 flex-1">
                <DocsPathBreadcrumb basePath="" segments={[PKG_PREFIX, ...slug]} />
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <DocsCopyPage page={doc.content} url={absoluteUrl(doc.slug)} />
                <DocsPagerTop doc={doc} />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className={cn('scroll-m-20 font-bold text-2xl tracking-tight sm:text-3xl')}>{doc.title}</h1>
              {doc.description && <p className="text-base text-muted-foreground">{doc.description}</p>}
            </div>
          </header>
          <section className="pt-8 pb-12">
            <Mdx code={doc.body} />
          </section>
          <footer>
            <DocsPagerBottom doc={doc} />
            <div aria-hidden="true" id="bottom" />
          </footer>
        </article>
        {doc.toc && (
          <aside aria-label="On this page" className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 flex h-[calc(100vh-3.5rem)] flex-col py-12">
              <DashboardTableOfContents toc={doc.toc} />
              <Separator className="my-4 shrink-0" />
              <nav aria-label="Page actions" className="flex shrink-0 flex-col gap-1">
                <Button asChild className="justify-start" size="sm" variant="link">
                  <a
                    href={`https://github.com/gentleeduck/gentleduck/blob/master/apps/duck/content/docs/${sourcePath}`}
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
              </nav>
            </div>
          </aside>
        )}
      </main>
    </div>
  )
}

export default WwwPage
