import { buildChatContext } from '../context'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: Request) {
  let body: { query?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS_HEADERS })
  }

  const query = body.query
  if (!query || typeof query !== 'string' || query.length > 2000) {
    return Response.json({ error: 'Invalid query' }, { status: 400, headers: CORS_HEADERS })
  }

  try {
    const { sources } = await buildChatContext(query)
    return Response.json({ sources }, { headers: CORS_HEADERS })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Search failed' },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}
