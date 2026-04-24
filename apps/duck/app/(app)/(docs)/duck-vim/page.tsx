import { Badge } from '@gentleduck/registry-ui/badge'
import { Apple, Command, Keyboard, ListOrdered, Mic, Workflow } from 'lucide-react'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'

export const dynamic = 'force-static'
export const revalidate = false

const features = [
  {
    icon: Keyboard,
    title: 'useKeyBind',
    description: 'Bind a single combo. `ctrl+k`, `meta+shift+p`, `mod+s`. Platform-aware, with `preventDefault`.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: ListOrdered,
    title: 'useKeySequence',
    description: 'Multi-step sequences like `g` then `d`. Configurable timeout between steps and chord-mode support.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Command,
    title: 'useKeyCommands',
    description: 'Register a whole command palette at once. Bind each command to a shortcut and render the list.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Mic,
    title: 'useKeyRecorder',
    description: 'Record user input for settings UIs. Users pick their own shortcuts and you persist the result.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Apple,
    title: 'Platform-aware Mod',
    description:
      '`Mod` resolves to `Cmd` on macOS and `Ctrl` everywhere else. Write one binding that feels native on both.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: Workflow,
    title: 'Framework-agnostic core',
    description:
      'Parser, matcher, sequence engine, and recorder live in plain TypeScript. The React hooks are a thin binding layer.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Install
bun add @gentleduck/vim

# Bind your first shortcut
import { KeyProvider, useKeyBind } from '@gentleduck/vim/react'`

export default async function DuckVimPage() {
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
    <div className="relative space-y-20">
      <div>
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Keyboard engine
            </Badge>
          </div>
          <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
            A typed keyboard command engine
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Parse hotkey strings, match live events, run chords and sequences, and record user input for a settings
            page. React hooks included.
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
          <p className="text-muted-foreground text-sm">Wrap your app in `KeyProvider`, then bind.</p>
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
