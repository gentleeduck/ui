import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Database, FileUp, Layers, Pause, Repeat, Zap } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { PackageStatusBadge } from '~/components/package-status-badge'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Upload'
const description =
  'Strategy-based file upload engine with React bindings. Pause, resume, retry, and persist uploads across reloads.'

const features = [
  {
    icon: FileUp,
    title: 'Strategy-based engine',
    description:
      'Swap upload backends without touching call sites. Direct, presigned, tus, S3 multipart. One contract, many transports.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Pause,
    title: 'Pause + resume',
    description:
      'Cancel in-flight uploads and resume from the last committed byte. Built on AbortController and per-chunk commits.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Repeat,
    title: 'Retries + backoff',
    description: 'Per-chunk retries with exponential backoff. Flaky networks no longer drop partial work.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Database,
    title: 'Persistence adapter',
    description:
      'Pluggable persistence for IndexedDB or custom storage. Resume uploads across tab reloads and browser restarts.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Layers,
    title: 'React bindings',
    description:
      '`useUpload` hook, typed progress events, optimistic UI. Cache-aware state that plays well with React Query.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Zap,
    title: 'Zero lock-in',
    description:
      'The core is framework-agnostic. Use the React bindings, or wire it into Vue, Solid, or Svelte yourself.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/upload

# Use it
import { useUpload } from '@gentleduck/upload/react'
import { directStrategy } from '@gentleduck/upload/strategies'

const { upload, progress, pause, resume } = useUpload({
  strategy: directStrategy({ endpoint: '/api/upload' }),
})`

export default async function DuckUploadPage() {
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
        <PackageStatusBadge status="wip" />
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PageHeaderHeading className="max-w-none">{title}</PageHeaderHeading>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-upload/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-upload/core">Core Concepts</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {features.length} capabilities
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Uploads that survive reloads and flaky networks
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Three pieces: a core engine, a strategy contract, and a React hook. Pick a transport, wire it in, and ship
              resumable uploads with typed progress.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, bg, color }) => (
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
            <p className="text-muted-foreground text-sm">Pick a strategy, hook it into your form.</p>
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
