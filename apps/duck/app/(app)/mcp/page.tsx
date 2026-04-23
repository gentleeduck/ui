import { Badge } from '@gentleduck/registry-ui/badge'
import { BookOpen, Braces, Code2, Cpu, Download, History, Lightbulb, List, Search } from 'lucide-react'
import { codeToHtml } from 'shiki'
import { CopyButton } from '~/components/copy-button'
import { OpenSourceSection } from '~/components/layouts/open-source-section'

export const dynamic = 'force-static'
export const revalidate = false

const tools = [
  {
    icon: List,
    title: 'list_docs',
    description:
      'Browse the documentation catalog with pagination. Filter by category — components, installation, packages, changelog, and more.',
    bg: 'bg-blue-500/10',
    color: 'text-blue-500',
  },
  {
    icon: Search,
    title: 'search_docs',
    description:
      'Full-text search with typo tolerance across all 100+ pages. Results ranked by relevance — title matches score highest.',
    bg: 'bg-violet-500/10',
    color: 'text-violet-500',
  },
  {
    icon: BookOpen,
    title: 'read_doc',
    description:
      'Read any doc page with JSX/MDX stripped. Supports full, summary, and section modes to minimize token usage.',
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500',
  },
  {
    icon: Code2,
    title: 'get_component_api',
    description:
      'Extracts only the props table from a component page. The most token-efficient way to look up component APIs.',
    bg: 'bg-orange-500/10',
    color: 'text-orange-500',
  },
  {
    icon: Braces,
    title: 'get_examples',
    description:
      'Returns all code blocks from a doc page without the surrounding prose — just imports, JSX, and configuration.',
    bg: 'bg-pink-500/10',
    color: 'text-pink-500',
  },
  {
    icon: History,
    title: 'get_changelog',
    description:
      'Get changelog entries filtered by version or component. Useful for checking what changed in a specific release.',
    bg: 'bg-yellow-500/10',
    color: 'text-yellow-500',
  },
  {
    icon: Download,
    title: 'get_installation',
    description:
      'Get the setup guide for a framework by name — Next.js, Vite, Remix, Astro. Fuzzy-matched so "nextjs" works too.',
    bg: 'bg-sky-500/10',
    color: 'text-sky-500',
  },
  {
    icon: Lightbulb,
    title: 'suggest_components',
    description:
      'Describe what you need and get ranked component suggestions. Uses fuzzy matching across titles, descriptions, and content.',
    bg: 'bg-teal-500/10',
    color: 'text-teal-500',
  },
  {
    icon: Cpu,
    title: 'semantic_search',
    description:
      'Natural language search using TF-IDF + cosine similarity. "popup overlay" finds dialog even without exact keyword matches.',
    bg: 'bg-indigo-500/10',
    color: 'text-indigo-500',
  },
]

const SETUP_CODE = `# Claude Code (CLI)
claude mcp add duck-ui --transport http https://ui.gentleduck.org/api/mcp

# Claude Desktop / Cursor / Windsurf (mcp.json)
{
  "mcpServers": {
    "duck-ui": {
      "url": "https://ui.gentleduck.org/api/mcp"
    }
  }
}`

export default async function McpPage() {
  const highlightedCode = await codeToHtml(SETUP_CODE, {
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
      {/* Tools section */}
      <div>
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              9 tools
            </Badge>
          </div>
          <h2 className="mb-3 font-semibold text-2xl leading-tight tracking-tight sm:text-3xl">
            Everything your AI needs to build with duck&#8209;ui
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground leading-relaxed">
            Each tool is purpose-built to minimize token usage while maximizing accuracy. Browse, search, read, and
            introspect the entire duck&#8209;ui ecosystem — without leaving your AI assistant.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ icon: Icon, title, description, bg, color }) => (
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

      {/* Quick setup */}
      <div>
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <h2 className="font-semibold text-xl leading-tight tracking-tight">Quick setup</h2>
          <p className="text-muted-foreground text-sm">One URL. Works with Claude, Cursor, and Windsurf.</p>
        </div>
        <div className="relative mx-auto max-w-2xl">
          <CopyButton value={SETUP_CODE} variant="ghost" className="absolute top-3 right-3" />
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
