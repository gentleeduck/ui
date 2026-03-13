import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from './server'

const SESSION_TTL_MS = 30 * 60_000

export interface McpSessionConnection {
  sessionId: string
  server: ReturnType<typeof createMcpServer>
  transport: WebStandardStreamableHTTPServerTransport
  createdAt: number
  lastSeenAt: number
}

const sessions = new Map<string, McpSessionConnection>()

function touchSession(connection: McpSessionConnection): McpSessionConnection {
  connection.lastSeenAt = Date.now()
  return connection
}

export async function createSessionConnection(): Promise<McpSessionConnection> {
  const sessionId = crypto.randomUUID()
  let connection!: McpSessionConnection

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => sessionId,
    onsessioninitialized: (initializedSessionId) => {
      sessions.set(initializedSessionId, connection)
    },
    onsessionclosed: (closedSessionId) => {
      sessions.delete(closedSessionId)
    },
  })

  const server = createMcpServer()
  connection = {
    sessionId,
    server,
    transport,
    createdAt: Date.now(),
    lastSeenAt: Date.now(),
  }

  await server.connect(transport)
  return connection
}

export function getSessionConnection(sessionId: string): McpSessionConnection | null {
  const connection = sessions.get(sessionId)
  return connection ? touchSession(connection) : null
}

export async function disposeSessionConnection(connection: McpSessionConnection): Promise<void> {
  sessions.delete(connection.sessionId)
  await Promise.allSettled([connection.server.close()])
}

export async function closeSessionById(sessionId: string): Promise<boolean> {
  const connection = sessions.get(sessionId)
  if (!connection) return false

  await disposeSessionConnection(connection)
  return true
}

export function getSessionStoreStats(): { activeSessions: number; ttlMs: number } {
  return {
    activeSessions: sessions.size,
    ttlMs: SESSION_TTL_MS,
  }
}

async function pruneExpiredSessions(): Promise<void> {
  const now = Date.now()
  const expiredSessionIds = [...sessions.values()]
    .filter((connection) => now - connection.lastSeenAt > SESSION_TTL_MS)
    .map((connection) => connection.sessionId)

  await Promise.all(expiredSessionIds.map((sessionId) => closeSessionById(sessionId)))
}

setInterval(() => {
  void pruneExpiredSessions()
}, SESSION_TTL_MS).unref?.()
