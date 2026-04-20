import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardDescription, CardTitle } from '@gentleduck/registry-ui/card'
import {
  Bot,
  BrainCircuit,
  ExternalLink,
  FileCode2,
  Keyboard,
  LayoutTemplate,
  Puzzle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = false

const skills = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'simplify',
    description:
      'Reviews and cleans up code changes — removes dead code, redundant abstractions, and unnecessary complexity.',
    bg: 'bg-yellow-500/10',
    color: 'text-yellow-500',
    badge: 'stable',
  },
  {
    icon: <LayoutTemplate className="h-6 w-6" />,
    title: 'batch',
    description: 'Orchestrates large parallelizable changes — spawns isolated worker agents per module and merges PRs.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
    badge: 'stable',
  },
  {
    icon: <Keyboard className="h-6 w-6" />,
    title: 'caveman',
    description: 'Strips filler from AI responses — terse, technical, no pleasantries. Multiple intensity levels.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
    badge: 'stable',
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: 'loop',
    description: 'Runs autonomous iteration loops — the agent self-paces, wakes up, checks progress, and continues.',
    bg: 'bg-purple-500/10',
    color: 'text-purple-500',
    badge: 'stable',
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: 'plan',
    description:
      'Enters plan mode to architect implementations — decomposes work into units before writing a single line.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
    badge: 'stable',
  },
  {
    icon: <FileCode2 className="h-6 w-6" />,
    title: 'duck-add',
    description:
      'Adds gentleduck components to your project — wires imports, sets up config, generates usage examples.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
    badge: 'coming soon',
  },
  {
    icon: <Puzzle className="h-6 w-6" />,
    title: 'duck-migrate',
    description: 'Migrates from shadcn/ui or Radix to gentleduck primitives — automated codemods with diff review.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
    badge: 'coming soon',
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: 'duck-review',
    description:
      'Reviews component implementations against gentleduck conventions — accessibility, variants, displayName.',
    bg: 'bg-red-500/10',
    color: 'text-red-500',
    badge: 'coming soon',
  },
]

export default function SkillsPage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-purple-500/8 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-emerald-500/8 blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
            <Bot className="h-3 w-3" />
            Agent Skills
          </Badge>
          <p className="max-w-lg text-muted-foreground">
            Drop-in skills for Claude Code, Cursor, and other AI coding assistants. Each skill is a focused capability —
            install it once, use it everywhere.
          </p>
          <div className="flex gap-3">
            <Button asChild size="sm">
              <Link href="https://github.com/gentleeduck/duck-ui/tree/master/skills" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Browse on GitHub
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <Card
              key={s.title}
              className="group relative overflow-hidden rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">
              {s.badge === 'coming soon' && (
                <span className="absolute top-3 right-3 rounded-full border border-border/60 bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  soon
                </span>
              )}
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <CardTitle className="mb-1 font-mono font-semibold text-base">/{s.title}</CardTitle>
              <CardDescription>{s.description}</CardDescription>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/60 bg-muted/30 p-6">
          <p className="mb-3 font-mono text-muted-foreground text-sm">Install a skill</p>
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-sm">
            <code>{`# In Claude Code
/install-skill https://github.com/gentleeduck/duck-ui/tree/master/skills/simplify

# Or add to your project's skills/ directory
# and reference in .claude/settings.json`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
