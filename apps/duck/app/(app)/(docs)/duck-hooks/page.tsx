import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Clipboard, Clock, Fingerprint, Link2, Monitor, Timer } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Hooks'
const description =
  'Tree-shakeable React utility hooks. Each hook lives on its own subpath: debounce, media queries, clipboard, composed refs, stable IDs.'

const features = [
  {
    icon: Timer,
    title: 'useDebounce',
    description: 'Defer a value update until typing settles. Configurable delay in milliseconds.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Link2,
    title: 'useComposedRefs',
    description:
      'Merge callback refs, ref objects, and forwarded refs into one. The plumbing behind `asChild` forwarding.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Clipboard,
    title: 'useCopyToClipboard',
    description: 'Copy any string with the async clipboard API. Tracks the last value so you can echo it in a toast.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Monitor,
    title: 'useMediaQuery',
    description:
      'Subscribe to `(prefers-reduced-motion)`, `(max-width: 768px)`, or any media query. SSR-safe with a configurable default.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Fingerprint,
    title: 'useStableId',
    description: 'Generate SSR-safe, stable IDs for ARIA attributes. Built on `React.useId()` with a friendly prefix.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Clock,
    title: 'useComputedTimeoutTransition',
    description: 'Drive CSS transitions off an element’s computed transition-duration. No hardcoded timeouts.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/hooks

# Import any hook via its subpath
import { useDebounce } from '@gentleduck/hooks/use-debounce'`

export default async function DuckHooksPage() {
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
            name: '@gentleduck/hooks',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-hooks',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-hooks',
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
            <Link href="/duck-hooks/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-hooks"
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
                Tree-shakeable
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              One hook per subpath
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Each hook has its own entry point. Import the one you need. The rest never reaches your bundle.
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
            <p className="text-muted-foreground text-sm">Import each hook from its subpath.</p>
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
