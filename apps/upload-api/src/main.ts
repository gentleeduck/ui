import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { WebSocketServer } from 'ws'
// import { renderTrpcPanel } from 'trpc-panel'
import { createTRPCContext, createTRPCRouter } from './globals'
import { uploadRouter } from './upload'

const app = new Hono()

// CORS
app.use(cors({ origin: '*' }))

// DOTENV CONFIG
import { createWSContext } from './ws'
import { ee, ws_router } from './ws-router'

// TRPC ROUTER
export const appRouter = createTRPCRouter({
  upload: uploadRouter,
  ws: ws_router,
})
export type AppRouter = typeof appRouter

// TODO: support tRPC types
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    // @ts-ignore: trpcServer is not typed
    createContext: createTRPCContext,
  })
)

import { renderTrpcPanel } from 'trpc-ui'

// @ts-ignore: trpcServer is not typed
app.use('/panel', c => {
  const panelHTML = renderTrpcPanel(appRouter, {
    url: 'http://localhost:4000/trpc', // Base url of your trpc server
    meta: {
      title: 'My Backend Title',
      description:
        'This is a description of my API, which supports [markdown](https://en.wikipedia.org/wiki/Markdown).',
    },
  })

  return c.html(panelHTML)
})

const wss = new WebSocketServer({
  port: 4051,
})

// @ts-ignore: trpcServer is not typed
const ws_trpc = applyWSSHandler({
  wss,
  router: ws_router,
  // @ts-ignore: trpcServer is not typed
  createContext: createWSContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
})

wss.on('connection', ws => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  ws_trpc.broadcastReconnectNotification()
  wss.close()
})

setInterval(() => {
  const randomNumber = Math.random()
  ee.emit('randomNumber', randomNumber)
}, 1000)

serve(
  {
    port: 4050,
    fetch: app.fetch,
  },
  () => {
    console.log(`🦆⋆🐧⋆ API: Listening on port ${4050}`)
    console.log(`🦆⋆🐧⋆ TRPC: http://localhost:${4050}/trpc`)
    console.log(`🦆⋆🐧⋆ TRPC_PANEL: http://localhost:${4050}/panel`)
    console.log(`🦆⋆🐧⋆ WEBSOCKET: ws://localhost:${4051}`)
  }
)

/**
 * @see https://trpc.io/docs/v10/subscriptions#:~:text=/packages/server/src,codes.ts.
 * @see https://trpc.io/docs/v10/subscriptions#:~:text=/packages/server/src,codes.ts.
 */

/* import { db } from './drizzle'
import { buckets, files, folders, users } from './drizzle'
import { uuid } from 'drizzle-orm/pg-core'
import { ENV } from './globals'
const user = await db
  .insert(users)
  .values({
    name: 'wildduck',
    email: 'duckui@duck.com',
    password: 'wildduck',
  })
  .returning({ id: users.id })

const bucket = await db
  .insert(buckets)
  .values({
    name: 'test',
    description: 'test',
    user_id: user[0].id,
  })
  .returning({ id: buckets.id })

const folder = await db
  .insert(folders)
  .values({
    name: 'test',
    tree_level: 0,
    bucket_id: bucket[0].id,
  })
  .returning({ id: folders.id })

await db.insert(files).values({
  name: 'test',
  size: 123123123,
  url: 'test',
  type: 'image/jpeg',
  tree_level: 0,
  bucket_id: bucket[0].id,
})

await db.insert(files).values({
  name: 'test',
  size: 12123123,
  url: 'test',
  tree_level: 1,
  folder_id: folder[0].id,
  bucket_id: bucket[0].id,
}) */
