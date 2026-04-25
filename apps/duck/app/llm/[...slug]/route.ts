import { docs } from '../../../.velite'

export const dynamic = 'force-static'
export const dynamicParams = false

function findDoc(slug: string[]): string | null {
  const path = slug.join('/')
  const candidates = [path, `${path}/index`]
  const doc = docs.find((d) => candidates.includes(d.permalink))
  return doc?.content ?? null
}

export async function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.permalink.replace(/\/index$/, '').split('/') }))
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const content = findDoc(slug)

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
