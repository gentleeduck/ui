import { Badge } from '@gentleduck/registry-ui/badge'
import { Blocks, Calendar, Keyboard, LayoutTemplate, Terminal } from 'lucide-react'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'

export const dynamic = 'force-static'
export const revalidate = false

const skills = [
  {
    icon: LayoutTemplate,
    title: 'duck-ui',
    pkg: '@gentleduck/registry-ui',
    description: 'Styled Tailwind components, variant system, compound patterns, and coding style conventions.',
    bg: 'bg-cyan-500/10',
    color: 'text-cyan-500',
    soon: false,
  },
  {
    icon: Blocks,
    title: 'duck-primitives',
    pkg: '@gentleduck/primitives',
    description: 'Headless a11y-first primitives, scoped context, Slot/asChild pattern, and Presence.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
    soon: false,
  },
  {
    icon: Blocks,
    title: 'duck-variants',
    pkg: '@gentleduck/variants',
    description: 'cva() variant function, Variants.VariantProps, Variants namespace, and full type inference.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
    soon: false,
  },
  {
    icon: Terminal,
    title: 'duck-cli',
    pkg: '@gentleduck/cli',
    description: 'CLI commands, template scaffolding, and the command authoring pattern.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
    soon: false,
  },
  {
    icon: Keyboard,
    title: 'duck-vim',
    pkg: '@gentleduck/vim',
    description: 'Keyboard engine, hotkey parsing, chord sequences, and React hooks.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
    soon: false,
  },
  {
    icon: Calendar,
    title: 'duck-calendar',
    pkg: '@gentleduck/calendar',
    description: 'Headless calendar engine, date adapters, selection modes, and locale support.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
    soon: true,
  },
]

const INSTALL_CODE = `# Install all skills
npx skills add gentelduck/ui

# Install a single skill
npx skills add gentelduck/ui --skill duck-primitives`

export default async function SkillsPage() {
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
    <div className="relative space-y-20">
      {/* Skills section */}
      <div>
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {skills.length} skills
            </Badge>
          </div>
          <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
            Teach your AI every package in duck&#8209;ui
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Each skill is scoped to a single package — the agent only loads the context it needs. Skills follow the open{' '}
            <a
              href="https://agentskills.io/specification"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground">
              Agent Skills specification
            </a>{' '}
            and work with Claude Code, Cursor, Cline, and 30+ other agents.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map(({ icon: Icon, title, pkg, description, bg, color, soon }) => (
            <div
              key={title}
              className="relative flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border">
              {soon && (
                <span className="absolute top-3 right-3 rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  soon
                </span>
              )}
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 pr-8">
                <p className="mb-0.5 font-mono text-[10px] text-muted-foreground">{pkg}</p>
                <h3 className="mb-1 font-mono font-semibold text-sm">{title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Install */}
      <div>
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <h2 className="font-semibold text-xl leading-tight tracking-tight">Install</h2>
          <p className="text-muted-foreground text-sm">One command. Works with Claude Code, Cursor, and Copilot.</p>
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
  )
}
