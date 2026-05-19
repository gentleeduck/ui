import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { AlertTriangle, ArrowRight, Command, Globe, Keyboard, ListOrdered } from 'lucide-react'
import Link from 'next/link'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '~/components/layouts/page-header'
import { PackageStatusBadge } from '~/components/package-status-badge'

export const dynamic = 'force-static'
export const revalidate = false

const title = 'Duck Shortcut'
const description =
  'Deprecated React keyboard shortcut hook — superseded by @gentleduck/vim. Still documented for existing users.'

const features = [
  {
    icon: AlertTriangle,
    title: 'Deprecated',
    description:
      'This package is deprecated. Use `@gentleduck/vim` instead — same ideas, richer API, active development.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Command,
    title: 'Key combinations',
    description: 'Classic combos like `ctrl+s` or `command+k`. Case-insensitive, platform-aware.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: ListOrdered,
    title: 'Key sequences',
    description: 'Konami-style sequences — `Up Up Down Down Left Right B A Enter`. Mixes seamlessly with combinations.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Keyboard,
    title: 'useDuckShortcut',
    description: 'One hook. Pass `keys` and `onKeysPressed`. Works with a single binding or an array of alternatives.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Globe,
    title: 'Global listener',
    description: 'Single document-level listener, no event-capture conflicts between mounted instances.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: ArrowRight,
    title: 'Migrate to duck-vim',
    description:
      '`@gentleduck/vim` is a drop-in successor with chord bindings, key recording, scoped contexts, and React hooks.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Deprecated — prefer @gentleduck/vim
bun add @gentleduck/shortcut

# Upgrade path
bun add @gentleduck/vim`

export default async function DuckShortcutPage() {
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
    <div className="container pt-24 pb-8">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: '@gentleduck/shortcut',
            description,
            programmingLanguage: 'TypeScript',
            url: 'https://gentleduck.org/duck-shortcut',
            codeRepository: 'https://github.com/gentleeduck/gentleduck/tree/master/packages/deprecated/duck-shortcut',
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Ahmed Ayob', url: 'https://github.com/wildduck2' },
          }),
        }}
      />
      <PageHeader>
        <PackageStatusBadge status="deprecated" />
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <PageHeaderHeading className="max-w-none">{title}</PageHeaderHeading>
        </div>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/duck-shortcut/introduction">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/duck-vim/introduction">Use duck-vim instead</Link>
          </Button>
        </div>
      </PageHeader>
      <div className="relative space-y-20">
        <div>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Badge variant="destructive" className="text-xs">
                Deprecated
              </Badge>
            </div>
            <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
              Prefer duck-vim for new projects
            </h2>
            <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
              Duck Shortcut still works, but it’s in maintenance mode. `@gentleduck/vim` covers every feature here plus
              key recording, chord bindings, scoped contexts, and platform-aware Mod resolution.
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
            <h2 className="font-semibold text-xl leading-tight tracking-tight">Migration path</h2>
            <p className="text-muted-foreground text-sm">
              Already using duck-shortcut? Swap to duck-vim at your pace — the docs cover the API diff.
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
