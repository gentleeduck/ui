import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { FileCode, Gauge, Layers, Puzzle, Settings, TestTube } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Registry Build'
const description =
  'Extension-driven build system for component registries. Configurable pipeline, typed sources, and a UI preset ready to use.'

const features = [
  {
    icon: Puzzle,
    title: 'Extension-driven',
    description:
      'The builder runs a pipeline of extensions. Use `uiRegistryPreset()` for the standard UI path, or write your own for any domain.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Settings,
    title: 'defineConfig()',
    description:
      'One config entry types your sources, package mappings, and registry entries. Typos fail as TypeScript errors.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Layers,
    title: 'Sources + targets',
    description:
      'Map each registry namespace to a source folder, a package name, and a reference path. The builder resolves imports across workspaces.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: FileCode,
    title: 'Schema validation',
    description:
      'Every registry item is validated as a `registry:*` namespace string. The same rule runs across sources, mappings, and schemas.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Gauge,
    title: 'Cache-aware pipeline',
    description:
      'Phased build context with an integrated cache. Only touched registries re-run, so big registries still finish in seconds.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: TestTube,
    title: 'Testing + CI',
    description:
      'Built-in extensions for banners, colors, component index, and validation. Output hooks drop into any CI job.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add -D @gentleduck/registry-build

# Build your registry
bunx registry-build build`

export default async function DuckRegistryBuildPage() {
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
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/registry-build',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-registry-build',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/registry-build',
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
            <Link href="/duck-registry-build/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-registry-build/configuration">Configuration</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Generic + extensible
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              The engine behind gentleduck registries
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              A config, a preset, and a pipeline of extensions. Use it for UI kits, icon sets, or any domain you can
              model as a registry.
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
              Add a `registry-build.config.ts`, run the CLI, ship a registry.
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
