import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const CONTENT_DIR = join(process.cwd(), 'content', 'docs')

async function readMdxFile(slug: string[]): Promise<string | null> {
  const path = slug.join('/')
  const candidates = [join(CONTENT_DIR, `${path}.mdx`), join(CONTENT_DIR, path, 'index.mdx')]

  for (const filePath of candidates) {
    try {
      return await readFile(filePath, 'utf-8')
    } catch {}
  }

  return null
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const content = await readMdxFile(slug)

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
