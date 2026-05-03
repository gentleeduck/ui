import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { CalendarClock, Filter, Hash, Layers, Merge, Package } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Libs'
const description =
  'Shared utilities for the gentleduck ecosystem. cn(), filteredObject, groupArray, parseDate. Each helper lives on its own subpath.'

const features = [
  {
    icon: Merge,
    title: 'cn()',
    description:
      'Class-name merger built on clsx and tailwind-merge. Deduplicates conflicting Tailwind utilities so the last class wins.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Filter,
    title: 'filteredObject',
    description:
      'Pick or omit keys from an object with a typed result. A typed replacement for `lodash.pick` and `omit`.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Layers,
    title: 'groupArray',
    description:
      'Group a list by key or by function. Returns a record keyed by the group, values are the matching items.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Hash,
    title: 'groupDataByNumbers',
    description:
      'Bucket numeric data into explicit ranges. Handy for histograms, charts, and ad-hoc analytics on arrays of numbers.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: CalendarClock,
    title: 'parseDate',
    description:
      'Parse strings, numbers, or `Date` inputs into a real `Date`. Returns `null` for invalid input so you can early-return.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Package,
    title: 'Subpath imports',
    description:
      'Every helper ships under its own entry point. `@gentleduck/libs/cn`, `/parse-date`, and so on. No framework deps.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/libs

# Use the most popular helper
import { cn } from '@gentleduck/libs/cn'`

export default async function DuckLibsPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'bash',
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
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/libs',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-libs',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-libs',
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
            <Link href="/duck-libs/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-libs"
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
                Zero deps
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              The utility layer behind every gentleduck package
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Use it standalone whenever you reach for `cn()`, a date parser, or a grouping helper. Every other
              `@gentleduck` package depends on it.
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
            <p className="text-muted-foreground text-sm">Import any helper from its subpath.</p>
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
