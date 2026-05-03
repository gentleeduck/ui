import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Feather, Layers, Palette, Settings, Shield, Type } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Variants'
const description =
  'Type-safe variant system with cva(). Compound variants, default variants, and a VariantProps helper, all inferred from your config.'

const features = [
  {
    icon: Type,
    title: 'Type-safe variants',
    description:
      'Every variant, default, and compound is inferred. `VariantProps<typeof button>` returns the union of legal props.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Palette,
    title: 'Variant-driven styles',
    description:
      'Define variants once, reuse them everywhere. `intent`, `size`, `tone`, whatever your design system needs.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Settings,
    title: 'Default variants',
    description: 'Declare defaults so consumers rarely have to spell them out. Override per instance when you need to.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Layers,
    title: 'Compound variants',
    description:
      'Add extra classes when multiple variants match. Handy for `primary + lg` accents or `outline + destructive` combos.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Feather,
    title: 'Zero dependencies',
    description: 'Works with Tailwind, but not tied to it. Use it with any className-based styling solution.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Shield,
    title: 'cva-compatible',
    description: 'API-compatible with class-variance-authority. Migrate an existing codebase by changing the import.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/variants

# Author a variant system
import { cva, type VariantProps } from '@gentleduck/variants'`

export default async function DuckVariantsPage() {
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
            name: '@gentleduck/variants',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-variants',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-variants',
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
            <Link href="/duck-variants/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-variants"
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
                Type-safe cva()
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Variant systems with full type inference
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              A cva-compatible variant authoring tool. Defaults, compound variants, and a typed `VariantProps` helper.
              No build step, no runtime surprises.
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
            <p className="text-muted-foreground text-sm">Author variants, export the types.</p>
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
