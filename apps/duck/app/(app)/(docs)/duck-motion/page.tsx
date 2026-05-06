import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Accessibility, Clock, Feather, Gauge, Sparkles, Waves } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { PackageStatusBadge } from '~/components/package-status-badge'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Motion'
const description =
  'Animation tokens, easing presets, spring configs, and reduced-motion helpers. Optional feature loaders for the motion library.'

const features = [
  {
    icon: Clock,
    title: 'Duration tokens',
    description:
      '`duckDuration.fast` (150 ms), `.normal` (200 ms), `.slow` (300 ms). Consistent timing across every animated component.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Waves,
    title: 'Easing presets',
    description: '`duckEasing.standard` and `.spring`. Reusable cubic-bezier and spring curves tuned for UI motion.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Accessibility,
    title: 'Reduced motion',
    description:
      '`useDuckReducedMotion()` and `motionTransition()` drop durations to zero when the user opts out. Same API either way.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'Animation presets',
    description:
      'Tree-shakeable `fadeIn`, `scaleIn`, `slideUp`, plus blur and asymmetric-exit variants. Pick one, drop it in.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Gauge,
    title: 'Spring transitions',
    description: '`duckSpringDefault`, `.snappy`, `.gentle`. Pass them straight to the motion library.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Feather,
    title: 'Motion library integration',
    description: '`MotionProvider`, `LazyMotion` feature loaders, `useMotionPreset()`. Load only the features you use.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/motion

# Respect reduced-motion by default
import { motionTransition, useDuckReducedMotion } from '@gentleduck/motion'`

export default async function DuckMotionPage() {
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
            name: '@gentleduck/motion',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-motion',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-motion',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <PageHeader>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PackageStatusBadge status="wip" />
          <PageHeaderHeading className="max-w-none">{title}</PageHeaderHeading>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-motion/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-motion"
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
                A11y by default
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Motion that respects reduced-motion by default
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Tokens, springs, and reduced-motion helpers. Every animation you compose reads the OS accessibility
              preference and drops duration to zero when it is set.
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
            <p className="text-muted-foreground text-sm">Use the tokens, presets, and reduced-motion helpers.</p>
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
