import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Calendar, Feather, Globe, Keyboard, Layers, Zap } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Calendar'
const description =
  'Headless calendar engine. Ships Gregorian, Islamic, Persian, and Hebrew systems, seven date adapters, full keyboard and ARIA support. ~5 KB gzipped.'

const features = [
  {
    icon: Calendar,
    title: 'Headless engine',
    description:
      'Framework-agnostic core with compound hooks. You write the markup. duck-calendar handles state, ARIA, and keyboard.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Globe,
    title: 'Multi-calendar',
    description:
      'Gregorian, Islamic, Persian, and Hebrew systems are built in. Switch systems without rewriting your date UI.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Layers,
    title: 'Date adapters',
    description:
      'Plug in native Date, date-fns, dayjs, or luxon. Seven adapters included, or write your own against the adapter contract.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Feather,
    title: '75% smaller',
    description:
      '5 KB gzipped versus 20 KB for react-day-picker. Zero dependencies. The core ships nothing but your calendar.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Keyboard,
    title: 'Full a11y',
    description:
      'Arrow-key navigation, Home/End row jumps, PageUp/PageDown month jumps, and complete ARIA grid semantics.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Zap,
    title: 'Single / range / multi',
    description:
      'One hook covers every selection mode. Switch from single date to range to multi-select with one prop.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/calendar

# Use it
import { NativeAdapter, useCalendar } from '@gentleduck/calendar'`

export default async function DuckCalendarPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'bash',
    themes: {
      dark: 'catppuccin-mocha',
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
            name: '@gentleduck/calendar',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-calendar',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-calendar',
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
            <Link href="/duck-calendar/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-calendar/api/use-calendar">API Reference</Link>
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
              Own the markup. Ship the engine.
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              State machine, adapters, and a11y plumbing ship with the package. You write the markup. 4 calendar
              systems, 7 date adapters, no framework lock-in.
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
            <p className="text-muted-foreground text-sm">Pick your adapter. Pick your calendar system.</p>
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
