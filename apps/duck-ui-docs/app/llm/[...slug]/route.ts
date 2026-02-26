import { docs } from '../../../.velite'

function resolveDoc(slug: string[]) {
  const path = slug.join('/').replace(/^\/|\/$/g, '')
  const candidates = [path, path.replace(/^docs\//, ''), path === '' ? 'index' : `${path}/index`]

  return (
    docs.find(
      (doc) =>
        candidates.includes(doc.permalink) ||
        candidates.includes(doc.slug) ||
        candidates.includes(doc.slug.replace(/^docs\//, '')),
    ) ?? null
  )
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const doc = resolveDoc(slug)

  if (!doc) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(doc.content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
    status: 200,
  })
}
