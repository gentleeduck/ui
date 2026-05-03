import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Accessibility, Blocks, Component, Feather, Keyboard, Shield } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Primitives'
const description =
  'Headless, accessibility-first React primitives. Shared Slot, Presence, Popper, and focus-scope load once, so Alert Dialog ships at 1.6 KB and Popover at 2.4 KB.'

const features = [
  {
    icon: Feather,
    title: 'Shared internals',
    description:
      'Alert Dialog: 1.6 KB. Popover: 2.4 KB. Shared Slot, Presence, Popper, and focus-scope load once across every primitive.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Accessibility,
    title: 'A11y built in',
    description:
      'Every primitive ships with the right roles, states, and keyboard interactions. Compose them and ARIA is already wired.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Blocks,
    title: 'Compound components',
    description:
      'Compose `Root`, `Trigger`, `Content`, and `Portal` with scoped context. Each part owns its concern, no prop drilling.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Keyboard,
    title: 'Keyboard everything',
    description:
      'Roving focus, type-ahead search, arrow-key navigation, and focus trapping. Same semantics across menus, dialogs, and selects.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Shield,
    title: 'Familiar API',
    description:
      'Compound parts, `asChild`, `data-state` attributes. If you have used a headless primitive library before, the vocabulary is the same.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Component,
    title: '40+ primitives',
    description:
      'Dialog, Popover, Select, Menu, Command, Calendar, Input OTP, Navigation Menu. All headless and unstyled.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/primitives

# Import any primitive
import { Root, Trigger, Portal, Content } from '@gentleduck/primitives/dialog'`

export default async function DuckPrimitivesPage() {
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
            name: '@gentleduck/primitives',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-primitives',
            codeRepository: 'https://github.com/gentleeduck/duck-ui/tree/master/packages/duck-primitives',
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
            <Link href="/duck-primitives/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-primitives/api/dialog">API Reference</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Headless + a11y-first
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Unstyled primitives, shared internals
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              A headless, accessibility-first component library. Slot, Presence, Popper, and focus-scope are shared
              across every primitive, so each one stays small.
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
            <p className="text-muted-foreground text-sm">Import each primitive from its own subpath.</p>
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
