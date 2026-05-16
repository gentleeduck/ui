import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Blocks, Cloud, FileJson, Layers, Terminal, Workflow } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Template'
const description =
  'Rust-powered project scaffolder. JSON-driven templates with variants, remote configs, and flag injection.'

const features = [
  {
    icon: FileJson,
    title: 'JSON-driven',
    description:
      'A single `duck-template.json` drives the whole scaffold — files, variables, conditional blocks, variants.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Layers,
    title: 'Variants',
    description:
      'One template, many layouts. Call `create-variant` to package a directory as a reusable variant (api, web, cli).',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Cloud,
    title: 'Remote configs',
    description: 'Templates can live in a git repo or any URL. Point duck-template at a link and it fetches + renders.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Terminal,
    title: 'CLI subcommands',
    description:
      '`init`, `create`, `create-variant`. Each has its own flags; all plug into the shared template engine.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Workflow,
    title: 'Flag injection',
    description:
      'Arbitrary CLI flags are parsed once and forwarded into template context. Define `{{project_name}}` and pass `--project_name`.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Blocks,
    title: 'Rust binary',
    description: 'Single statically linked binary. No Node runtime. `cargo install duck-template` and you are done.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
cargo install duck-template

# New project
duck-template init --name my-app

# From a variant
duck-template create --variant api --name my-api`

export default async function DuckTemplatePage() {
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
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-template/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://github.com/gentleeduck/duck-template" target="_blank" rel="noreferrer">
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
                Rust · CLI
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Scaffold projects the way your team actually writes them
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Define a JSON template, commit it with your code, reuse it across every new project. Variants handle
              differences between api, web, and cli shapes without forking.
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
            <p className="text-muted-foreground text-sm">Install via cargo. Run `init`. Commit your template.</p>
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
