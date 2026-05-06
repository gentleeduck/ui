import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Eye, Feather, FileType, Languages, Scan, Shield } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Gen'
const description =
  'Scans your TypeScript server code and emits .d.ts files so client types stay locked to your backend routes and message keys.'

const features = [
  {
    icon: Scan,
    title: 'Route scanning',
    description:
      'Walks your NestJS / TypeScript server modules and extracts every route (verbs, params, bodies, responses) into one type graph.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: FileType,
    title: 'Emit .d.ts',
    description:
      'Generates declaration files your client imports directly. No runtime, no codegen DSL. Typed modules out.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Languages,
    title: 'Message keys',
    description:
      'Scans i18n catalogs and emits unions of valid keys. Typos fail at compile time instead of silently at runtime.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Feather,
    title: 'Zero runtime',
    description:
      'Ships as a CLI. Nothing lands in your bundle. Emitted types are plain .d.ts files erased at build time.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Eye,
    title: 'Watch mode',
    description:
      'Re-generates on file changes. Keep duck-gen running next to your dev server and client types track the backend live.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Shield,
    title: 'Schema export',
    description:
      'Ships `duck-gen.schema.json` for editor validation of your config. Autocomplete and hover docs come with it.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add -D @gentleduck/gen

# Generate types
bunx duck-gen`

export default async function DuckGenPage() {
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
    <div className="container py-8">
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-gen/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-gen/api-routes">API Routes</Link>
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
              Your backend is the source of truth
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Duck Gen reads your server code and emits typed route and message modules. No duplicate OpenAPI schemas.
              No drift between client and production endpoints.
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
            <p className="text-muted-foreground text-sm">
              Works with NestJS today. Express and Fastify support is next.
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
