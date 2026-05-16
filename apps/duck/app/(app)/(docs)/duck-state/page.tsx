import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Atom, Feather, GitMerge, Globe, Layers, Zap } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { PackageStatusBadge } from '~/components/package-status-badge'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck State'
const description =
  'Atom-based state management for React — Jotai-inspired primitives, auto dependency tracking, derived atoms, and a standalone store.'

const features = [
  {
    icon: Atom,
    title: 'Atom-based',
    description:
      'Create primitive, derived, or writable-derived atoms. State is a graph of atoms — simple to read, easy to reason about.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: GitMerge,
    title: 'Auto dependency tracking',
    description:
      'Derived atoms subscribe to their reads. No selectors, no dependency arrays — change propagates where it should.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Globe,
    title: 'Standalone store',
    description:
      '`createStore()` works outside React. Read, write, subscribe — use it in workers, tests, or any JS environment.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Zap,
    title: 'React bindings',
    description: '`useAtom`, `useAtomValue`, `useSetAtom`, `useStore`, and a `<Provider>` — familiar Jotai-style API.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Layers,
    title: 'Writable derived',
    description:
      'Derive for read, inject a setter for write. Keep computed state in one place without scattering update logic.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Feather,
    title: 'Jotai-inspired, tiny',
    description: 'Same mental model, lean surface area. No boilerplate, no middleware registry, no provider soup.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/state

# Create an atom
import { atom, createStore } from '@gentleduck/state'`

export default async function DuckStatePage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'bash',
    themes: {
      dark: 'catppuccin-mocha',
      light: 'github-light',
    },
    defaultColor: 'dark',
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
    <div className="container pt-24 pb-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/state',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-state',
            codeRepository: 'https://github.com/gentleeduck/gentleduck/tree/master/packages/wip/duck-state',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <PageHeader>
        <PackageStatusBadge status="experimental" />
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PageHeaderHeading className="max-w-none">{title}</PageHeaderHeading>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-state/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/gentleduck/tree/master/packages/wip/duck-state"
              rel="noreferrer"
              target="_blank">
              View Source
            </Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Atom-based
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Small atoms, predictable state
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Duck State is a Jotai-inspired state primitive. Atoms hold values, derived atoms compute, and the store
              subscribes — no boilerplate in between.
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
            <h2 className="font-semibold text-xl leading-tight tracking-tight">Quick setup</h2>
            <p className="text-muted-foreground text-sm">
              One install. Use the standalone store or the React bindings — both ship from the same package.
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
