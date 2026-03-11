import { getDocsIndexStats, MCP_TOOL_COUNT } from '../server'
import { getSessionStoreStats } from '../session-store'

const HEALTH_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Last-Event-ID, Mcp-Session-Id',
  'Access-Control-Max-Age': '86400',
} as const

export async function GET() {
  const docs = await getDocsIndexStats()
  const sessions = getSessionStoreStats()

  return new Response(
    JSON.stringify(
      {
        status: 'ok',
        transport: 'streamable-http',
        toolCount: MCP_TOOL_COUNT,
        docs,
        sessions,
        checkedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...HEALTH_CORS_HEADERS,
      },
    },
  )
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEALTH_CORS_HEADERS })
}
