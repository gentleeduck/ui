import { Badge } from '@gentleduck/registry-ui/badge'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardDescription, CardTitle } from '@gentleduck/registry-ui/card'
import { BotMessageSquare, Braces, ExternalLink, Layers, Plug, Terminal, Wand2, Zap } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = false

const features = [
  {
    icon: <BotMessageSquare className="h-6 w-6" />,
    title: 'AI-Native Component Access',
    description: 'Let Claude, Cursor, or Copilot browse and add gentleduck components directly — no copy-paste.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: <Braces className="h-6 w-6" />,
    title: 'Code Generation',
    description: 'Generate full component usage examples, form schemas, and page layouts from a single prompt.',
    bg: 'bg-purple-500/10',
    color: 'text-purple-500',
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: 'Component Registry',
    description: 'The entire duck-ui component registry exposed as MCP tools — filterable, searchable, documented.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: <Plug className="h-6 w-6" />,
    title: 'One-Line Setup',
    description: 'Add one line to your MCP config and your AI assistant knows the entire component library.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: 'Theme Aware',
    description: 'Generated code respects your active theme, color palette, and variant configuration automatically.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Zero Bundle Impact',
    description: 'MCP runs as a sidecar — nothing added to your production bundle. Pure DX, no trade-offs.',
    bg: 'bg-yellow-500/10',
    color: 'text-yellow-500',
  },
]

export default function McpPage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-blue-500/8 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 -bottom-20 h-64 w-64 rounded-full bg-purple-500/8 blur-[100px]"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
            <Terminal className="h-3 w-3" />
            Coming Soon
          </Badge>
          <p className="max-w-lg text-muted-foreground">
            The gentleduck MCP server bridges your AI coding assistant and the full component ecosystem — add
            components, generate code, and browse docs without leaving your editor.
          </p>
          <div className="flex gap-3">
            <Button asChild size="sm">
              <Link href="https://github.com/gentleeduck/duck-ui" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Follow on GitHub
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group overflow-hidden rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${f.bg} ${f.color}`}>
                {f.icon}
              </div>
              <CardTitle className="mb-1 font-semibold text-base">{f.title}</CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/60 bg-muted/30 p-6">
          <p className="mb-3 font-mono text-muted-foreground text-sm">Quick setup (coming soon)</p>
          <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-sm">
            <code>{`// .cursor/mcp.json  or  claude_desktop_config.json
{
  "mcpServers": {
    "duck-ui": {
      "command": "npx",
      "args": ["-y", "@gentleduck/mcp"]
    }
  }
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
