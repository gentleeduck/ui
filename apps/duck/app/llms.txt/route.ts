import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'content', 'docs')
const BASE_URL = 'https://gentleduck.org'

async function getAllDocPaths(dir: string = CONTENT_DIR, prefix: string = ''): Promise<string[]> {
  try {
    const entries = await readdir(dir, { encoding: 'utf8', withFileTypes: true })
    const paths: string[] = []
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        paths.push(...(await getAllDocPaths(fullPath, relativePath)))
      } else if (entry.name.endsWith('.mdx')) {
        paths.push(relativePath.replace(/\.mdx$/, ''))
      }
    }
    return paths
  } catch {
    return []
  }
}

function parseFrontmatter(content: string): { title: string; description: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { title: '', description: '' }
  const fm = match[1] ?? ''
  return {
    title: fm.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? '',
    description: fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '',
  }
}

export async function GET() {
  const paths = await getAllDocPaths()

  const lines: string[] = [
    '# @gentleduck/ui Documentation',
    '',
    '> A versatile and feature-rich UI component library built for modern web applications.',
    '',
    `## MCP Server: ${BASE_URL}/api/mcp`,
    '',
    '## Docs',
    '',
  ]

  for (const slug of paths) {
    const content =
      (await readFile(join(CONTENT_DIR, `${slug}.mdx`), 'utf-8').catch(() => null)) ??
      (await readFile(join(CONTENT_DIR, slug, 'index.mdx'), 'utf-8').catch(() => null))

    if (!content) continue
    const { title, description } = parseFrontmatter(content)
    const url = `${BASE_URL}/docs/${slug}`
    const mdUrl = `${BASE_URL}/docs/${slug}.md`
    lines.push(`- [${title || slug}](${url}): ${description || ''}`)
    lines.push(`  - Markdown: ${mdUrl}`)
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
