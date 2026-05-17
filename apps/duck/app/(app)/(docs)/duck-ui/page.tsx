import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Accessibility, Blocks, Component, Paintbrush, Palette, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

const SECTION_ORDER = [
  'Forms',
  'Selection',
  'Navigation',
  'Disclosure',
  'Overlay',
  'Data Display',
  'Feedback',
  'Layout',
]

interface ICatalogItem {
  slug: string
  title: string
  description: string
  section: string
  order: number
}

function readFrontmatterField(block: string, key: string): string | null {
  const m = block.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))
  if (!m) return null
  return m[1].replace(/^['"]|['"]$/g, '')
}

async function loadCatalog(): Promise<[string, ICatalogItem[]][]> {
  const dir = join(process.cwd(), 'content/docs/duck-ui/components')
  const files = await readdir(dir)
  const items: ICatalogItem[] = []
  for (const f of files) {
    if (!f.endsWith('.mdx')) continue
    const raw = await readFile(join(dir, f), 'utf8')
    const fmEnd = raw.indexOf('---', 3)
    if (fmEnd < 0) continue
    const block = raw.slice(3, fmEnd)
    const title = readFrontmatterField(block, 'title') ?? f.replace(/\.mdx$/, '')
    const description = readFrontmatterField(block, 'description') ?? ''
    const section = readFrontmatterField(block, 'section') ?? 'Other'
    const orderStr = readFrontmatterField(block, 'order')
    const order = orderStr ? Number(orderStr) : 1000
    items.push({ slug: f.replace(/\.mdx$/, ''), title, description, section, order })
  }
  const groups = new Map<string, ICatalogItem[]>()
  for (const it of items) {
    let bucket = groups.get(it.section)
    if (!bucket) {
      bucket = []
      groups.set(it.section, bucket)
    }
    bucket.push(it)
  }
  for (const list of groups.values()) {
    list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  }
  return [...groups.entries()].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a[0])
    const bi = SECTION_ORDER.indexOf(b[0])
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
}

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck UI'
const description =
  '55+ styled Tailwind components built on @gentleduck/primitives. The CLI copies source into your project so you own every file.'

const features = [
  {
    icon: Component,
    title: '55+ components',
    description:
      'Buttons, Dialogs, Selects, Tabs, Sidebar, Data Table, Calendar, Command, Carousel. The full kit, styled and ready to ship.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Blocks,
    title: 'Built on duck-primitives',
    description:
      'Every component sits on top of the headless `@gentleduck/primitives` layer. Styled and unstyled are one family.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Paintbrush,
    title: 'Tailwind + cva',
    description:
      'Components are authored with `cva()` variants and `cn()` merging. Override className per instance without forking.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Palette,
    title: 'Theming + dark mode',
    description:
      'OKLCH design tokens, CSS variables, and a built-in dark mode. Swap palettes by changing a few variables.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Accessibility,
    title: 'A11y inherited',
    description:
      'Keyboard, focus, and ARIA behavior from duck-primitives flows up unchanged. The styled layer never breaks it.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Sparkles,
    title: 'Copy, don’t depend',
    description: 'The CLI writes source directly into your project. You own every file. Patch, restyle, or extend it.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Scaffold with the CLI
npx @gentleduck/cli init

# Add your first component
npx @gentleduck/cli add button`

export default async function DuckUiPage() {
  const catalog = await loadCatalog()
  const totalComponents = catalog.reduce((n, [, list]) => n + list.length, 0)
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
    <main className="container pt-24 pb-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/registry-ui',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-ui',
            codeRepository: 'https://github.com/gentleeduck/gentleduck/tree/master/packages/registry-ui',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <nav aria-label="Primary actions" className="flex gap-3">
          <Button asChild>
            <Link href="/duck-ui/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-ui/installation">Installation</Link>
          </Button>
        </nav>
      </PageHeader>
      <div className="relative space-y-20">
        <section aria-labelledby="duck-ui-features">
          <header className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                55+ components
              </Badge>
            </div>
            <h2 id="duck-ui-features" className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              A UI kit you fully own
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              The styled layer of gentleduck: Tailwind and cva on top of a11y-first primitives. Scaffold with the CLI,
              copy source into your project, edit any class without forking.
            </p>
          </header>
          <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, bg, color }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-1 font-mono font-semibold text-sm">{title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="duck-ui-install">
          <header className="mb-8 flex flex-col items-center gap-1 text-center">
            <h2 id="duck-ui-install" className="font-semibold text-xl leading-tight tracking-tight">
              Install
            </h2>
            <p className="text-muted-foreground text-sm">
              One command to scaffold, one per component. Works with Next.js, Vite, Remix, and Astro.
            </p>
          </header>
          <figure className="relative mx-auto max-w-2xl">
            <CopyButton value={INSTALL_CODE} variant="ghost" className="absolute top-3 right-3" />
            <div
              className="overflow-hidden rounded-lg border border-border/50 bg-muted/30 [&_pre]:bg-transparent!"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </figure>
        </section>

        <section aria-labelledby="duck-ui-catalog">
          <header className="mb-8 flex flex-col items-center gap-1 text-center">
            <h2 id="duck-ui-catalog" className="font-semibold text-xl leading-tight tracking-tight">
              Component catalog
            </h2>
            <p className="text-muted-foreground text-sm">
              {totalComponents} components grouped by category. Click any to jump straight to the docs.
            </p>
          </header>
          <div className="flex flex-col gap-10">
            {catalog.map(([section, list]) => (
              <div key={section}>
                <h3 className="mb-3 font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  {section}
                  <span className="ml-2 font-normal text-muted-foreground/60">{list.length}</span>
                </h3>
                <ul className="grid list-none gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/duck-ui/components/${item.slug}`}
                        className="block rounded-lg border border-border/50 bg-card p-3 transition-colors hover:border-border hover:bg-accent">
                        <span className="block font-mono font-semibold text-sm">{item.title}</span>
                        {item.description && (
                          <span className="mt-1 line-clamp-2 block text-muted-foreground text-xs leading-relaxed">
                            {item.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <OpenSourceSection className="px-0!" />
      </div>
    </main>
  )
}
