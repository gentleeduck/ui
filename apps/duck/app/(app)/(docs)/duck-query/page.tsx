import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { ArrowDown, ArrowUp, Boxes, Pencil, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Query'
const description =
  'Typed Axios client. Pair it with a Duck Gen route map or supply your own. Bodies, params, queries, and responses are all typed.'

const methods = [
  {
    icon: ArrowDown,
    title: 'get',
    description: 'Typed GET with inferred response type, typed path params, and typed query strings.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: ArrowUp,
    title: 'post',
    description: 'Typed POST body and response. Compile fails if the body shape drifts from the route map.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Pencil,
    title: 'put',
    description: 'Full-replacement updates with a typed body and response. Reads route metadata from Duck Gen.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Pencil,
    title: 'patch',
    description: 'Partial updates typed against your DTOs. No hand-written interface duplication.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Trash2,
    title: 'del',
    description: 'Typed DELETE with typed params and response. Handles 204 No Content correctly.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Boxes,
    title: 'byMethod',
    description: 'Escape hatch for any HTTP verb. Full type inference over a route-map entry.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
  {
    icon: Send,
    title: 'request',
    description: 'Raw axios request with route-map config pre-filled. All options stay typed.',
    bg: 'bg-teal-500/10',
    color: 'text-teal-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/query axios

# Create a typed client
import { createDuckQueryClient } from '@gentleduck/query'
import type { Routes } from './generated'

export const api = createDuckQueryClient<Routes>({ baseURL: '/api' })`

export default async function DuckQueryPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'typescript',
    themes: {
      dark: 'catppuccin-macchiato',
      light: 'light-plus',
    },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            'no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none !bg-transparent text-sm font-mono'
        },
      },
    ],
  })

  return (
    <div className="container py-8">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-query/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-query/client-methods">Client Methods</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {methods.length} methods
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Axios calls checked by your compiler
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Feed in the route map from Duck Gen or one you define by hand. Every `.get`, `.post`, and `.patch` is
              typed end to end: params, body, query, response.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {methods.map(({ icon: Icon, title, description, bg, color }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1 font-mono font-semibold text-sm">{title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8 flex flex-col items-center gap-1 text-center">
            <h2 className="font-semibold text-xl leading-tight tracking-tight">Install</h2>
            <p className="text-muted-foreground text-sm">
              Install the peer, import the factory, start calling endpoints.
            </p>
          </div>
          <div className="relative mx-auto max-w-2xl">
            <CopyButton value={INSTALL_CODE} variant="ghost" className="absolute top-3 right-3" />
            <div
              className="overflow-hidden rounded-lg border border-border/50 bg-muted/30 [&_pre]:bg-transparent!"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        </div>

        <OpenSourceSection className="!px-0" />
      </div>
    </div>
  )
}
