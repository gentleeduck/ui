import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Eye, Feather, Image as ImageIcon, Layers, Timer, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Lazy'
const description =
  'Lazy-loading components and images for React. Built on IntersectionObserver. SSR-safe. Zero dependencies.'

const features = [
  {
    icon: Eye,
    title: 'IntersectionObserver',
    description:
      'Defers rendering until the wrapper enters the viewport. Takes the native observer `rootMargin` and `threshold` options.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Layers,
    title: 'DuckLazyComponent',
    description:
      'Wrap any subtree. Children mount when the wrapper intersects the viewport. A placeholder slot renders until then.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: ImageIcon,
    title: 'DuckLazyImage',
    description:
      'Lazy `<img>` that swaps the placeholder on load. Configurable fade transition, preserved aspect ratio.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Wand2,
    title: 'next/image friendly',
    description:
      'Use `DuckLazyImage` inside a Next.js app, or pass any image element as a child. No framework coupling.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Feather,
    title: 'Zero dependencies',
    description: 'Pure React plus the browser IntersectionObserver API. No polyfills, no extra weight.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Timer,
    title: 'SSR-safe',
    description:
      'Renders the placeholder on the server and upgrades on the client once the observer fires. No hydration mismatches.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/lazy

# Lazy mount a subtree
import { DuckLazyComponent } from '@gentleduck/lazy/lazy-component'`

export default async function DuckLazyPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'bash',
    themes: {
      dark: 'catppuccin-macchiato',
      light: 'catppuccin-mocha',
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
            name: '@gentleduck/lazy',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-lazy',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-lazy',
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
            <Link href="/duck-lazy/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-lazy"
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
                Viewport-aware
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Render only what the user can see
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Defer components and images until they scroll into view. Smaller initial HTML, faster first paint, cheaper
              hydration.
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
            <p className="text-muted-foreground text-sm">Wrap the parts of your tree that live below the fold.</p>
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
