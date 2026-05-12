import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

export const dynamic = 'force-static'
export const dynamicParams = false

// `apps/duck/scripts/build-llm-pages.mjs` runs after velite and writes
// one pre-rendered .md file per doc into `.gentleduck/_llm/<permalink>.md`,
// with ComponentSource/Preview tags inlined as fenced code blocks.
// Keeping the heavy work in the build script lets this route be a tiny
// fs lookup so the Netlify Lambda stays well under its 250 MB cap.
const LLM_DIR = join(process.cwd(), '.gentleduck', '_llm')

function listAllSlugs(): string[][] {
  if (!existsSync(LLM_DIR)) return []
  const slugs: string[][] = []
  const stack: string[] = [LLM_DIR]
  while (stack.length) {
    const dir = stack.pop()!
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(abs)
        continue
      }
      if (!entry.name.endsWith('.md')) continue
      const rel = relative(LLM_DIR, abs).replace(/\.md$/, '')
      const parts = rel
        .replace(/\/index$/, '')
        .split('/')
        .filter(Boolean)
      if (parts.length) slugs.push(parts)
    }
  }
  return slugs
}

function readDoc(slug: string[]): string | null {
  const path = slug.join('/')
  const candidates = [`${path}.md`, `${path}/index.md`]
  for (const candidate of candidates) {
    const file = join(LLM_DIR, candidate)
    try {
      if (existsSync(file) && statSync(file).isFile()) {
        return readFileSync(file, 'utf8')
      }
    } catch {
      // fall through
    }
  }
  return null
}

export async function generateStaticParams() {
  return listAllSlugs().map((slug) => ({ slug }))
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const content = readDoc(slug)

  if (!content) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
    status: 200,
  })
}
