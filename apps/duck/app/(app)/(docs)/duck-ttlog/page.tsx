import { Badge } from '@gentleduck/registry-ui/badge'
import { Cpu, FileArchive, Gauge, Layers, ShieldAlert, Zap } from 'lucide-react'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'

export const dynamic = 'force-static'
export const revalidate = false

const features = [
  {
    icon: Zap,
    title: 'Compile-time macros',
    description:
      'info!, debug!, warn!, error! do most work at macro-expansion time. Runtime cost is a ring-buffer write, not a formatter call.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Cpu,
    title: 'Lock-free ring buffer',
    description:
      'Log calls never block. Events land in an in-memory ring buffer a writer thread drains asynchronously.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: Layers,
    title: 'String interning',
    description:
      'Repeated messages, file paths, module paths, and keys are stored once. Memory use stays flat under sustained load.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Gauge,
    title: 'Decoupled listeners',
    description:
      'Listeners (stdout, file, network) run on their own thread. Application code never waits on IO from logging.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: FileArchive,
    title: 'Snapshot buffer',
    description:
      'A ring of recent events flushes to a compressed on-disk snapshot on demand — and automatically on panic or SIGTERM.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: ShieldAlert,
    title: 'Crash + signal capture',
    description:
      'Panic hook and signal handler write a snapshot before the process dies. Post-mortem has the last N events in context.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
]

const INSTALL_CODE = `# Add to Cargo.toml
[dependencies]
ttlog = "0.2"

# Use it
use ttlog::{Trace, info};

Trace::init();
info!("hello from ttlog");`

export default async function DuckTtlogPage() {
  const highlightedCode = await codeToHtml(INSTALL_CODE, {
    lang: 'rust',
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
              Rust · lock-free
            </Badge>
          </div>
          <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
            Logs fast enough to leave in production
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            A logging framework built for high-throughput Rust. Non-blocking writes, interned strings, decoupled IO, and
            a snapshot buffer that survives a crash.
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
          <h2 className="font-semibold text-xl leading-tight tracking-tight">Quick setup</h2>
          <p className="text-muted-foreground text-sm">Add to Cargo. Init once. Log from anywhere.</p>
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
