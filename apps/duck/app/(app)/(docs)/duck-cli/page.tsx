import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Diff, Download, GitBranch, List, RefreshCw, Terminal } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck CLI'
const description =
  'Command-line tool for scaffolding projects and installing gentleduck/ui components. Five commands: init, add, update, diff, list.'

const features = [
  {
    icon: Terminal,
    title: 'init',
    description:
      'Writes a `duck-ui.config.json`, wires Tailwind, installs base dependencies, and detects your framework.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Download,
    title: 'add',
    description:
      'Install registry components by name. Resolves dependencies, writes source into your project, and respects your tsconfig aliases.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: RefreshCw,
    title: 'update',
    description:
      'Pulls the latest registry source into components you already installed. Stay in sync without hand-editing 50 files.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Diff,
    title: 'diff',
    description: 'Diffs your local copy against the registry. Review upstream changes before running `update`.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: List,
    title: 'list',
    description: 'Browse the registry from your terminal. Categories, names, and current versions in one view.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: GitBranch,
    title: 'Monorepo-aware',
    description:
      'Pass `--monorepo` at init and `--workspace apps/web` on every command. The CLI scaffolds per-workspace.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Scaffold your project
npx @gentleduck/cli init

# Add components
npx @gentleduck/cli add button`

export default async function DuckCliPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'bash',
    themes: {
      dark: 'catppuccin-macchiato',
      light: 'github-light',
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
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/cli',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-cli',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-cli',
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
            <Link href="/duck-cli/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-cli"
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
                {features.length} commands
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Components as source, not as a dependency
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Duck CLI copies registry source into your project. You own every file. `update` pulls new revisions
              without forcing breaking changes on you.
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
            <p className="text-muted-foreground text-sm">Works with Next.js, Vite, Remix, and Astro.</p>
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
