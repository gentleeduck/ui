import { getRateLimitResponse } from './server'
import { createSessionConnection, disposeSessionConnection, getSessionConnection } from './session-store'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Last-Event-ID, Mcp-Session-Id',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
  'Access-Control-Max-Age': '86400',
} as const

function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function withCors(response: Response): Response {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

function jsonRpcErrorResponse(status: number, code: number, message: string): Response {
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code, message },
      id: null,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}

async function handleMcp(request: Request): Promise<Response> {
  const ip = getClientIp(request)
  const rateLimited = getRateLimitResponse(ip)
  if (rateLimited) return withCors(rateLimited)

  const sessionId = request.headers.get('mcp-session-id')

  if (sessionId) {
    const connection = getSessionConnection(sessionId)
    if (!connection) {
      return withCors(jsonRpcErrorResponse(404, -32001, 'Session not found'))
    }

    const response = await connection.transport.handleRequest(request)
    return withCors(response)
  }

  if (request.method !== 'POST') {
    return withCors(jsonRpcErrorResponse(400, -32000, 'Bad Request: Mcp-Session-Id header is required'))
  }

  const connection = await createSessionConnection()

  try {
    const response = await connection.transport.handleRequest(request)

    // Only retain connections that completed MCP initialization.
    if (!connection.transport.sessionId) {
      await disposeSessionConnection(connection)
    }

    return withCors(response)
  } catch (error) {
    await disposeSessionConnection(connection)
    throw error
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: Request) {
  return handleMcp(request)
}

export async function GET(request: Request) {
  return handleMcp(request)
}

export async function DELETE(request: Request) {
  return handleMcp(request)
}
