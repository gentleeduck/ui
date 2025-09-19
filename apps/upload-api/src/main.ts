import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
// import { renderTrpcPanel } from 'trpc-panel'
import { createTRPCContext, createTRPCRouter } from './globals'
import { uploadRouter } from './upload'

const app = new Hono()

// CORS
app.use(cors({ origin: '*' }))

// TRPC ROUTER
export const appRouter = createTRPCRouter({
  upload: uploadRouter,
})
export type AppRouter = typeof appRouter

// TODO: support tRPC types
app.use(
  '/trpc/*',
  trpcServer({
    // @ts-ignore: trpcServer is not typed
    createContext: createTRPCContext,
    router: appRouter,
  }),
)

import { renderTrpcPanel } from 'trpc-ui'

// @ts-ignore: trpcServer is not typed
app.use('/panel', (c) => {
  const panelHTML = renderTrpcPanel(appRouter, {
    meta: {
      description:
        'This is a description of my API, which supports [markdown](https://en.wikipedia.org/wiki/Markdown).',
      title: 'My Backend Title',
    },
    url: 'http://localhost:4000/trpc', // Base url of your trpc server
  })

  return c.html(panelHTML)
})

// serve(
//   {
//     port: 4050,
//     fetch: app.fetch,
//   },
//   () => {
//     console.log(`🦆⋆🐧⋆ API: Listening on port ${4050}`)
//     console.log(`🦆⋆🐧⋆ TRPC: http://localhost:${4050}/trpc`)
//     console.log(`🦆⋆🐧⋆ TRPC_PANEL: http://localhost:${4050}/panel`)
//     console.log(`🦆⋆🐧⋆ WEBSOCKET: ws://localhost:${4051}`)
//   }
// )

/**
 * @see https://trpc.io/docs/v10/subscriptions#:~:text=/packages/server/src,codes.ts.
 * @see https://trpc.io/docs/v10/subscriptions#:~:text=/packages/server/src,codes.ts.
 */

import { buckets, db, files, folders, users } from './drizzle'

const user = await db
  .insert(users)
  .values({
    email: 'duckui@gentleduck.com',
    name: 'wildduck',
    password: 'wildduck',
  })
  .returning({ id: users.id })

const bucket = await db
  .insert(buckets)
  .values({
    description: 'test',
    name: 'test',
    user_id: user[0].id,
  })
  .returning({ id: buckets.id })

const folder = await db
  .insert(folders)
  .values({
    bucket_id: bucket[0].id,
    name: 'test',
    tree_level: 0,
  })
  .returning({ id: folders.id })

await db.insert(files).values({
  bucket_id: bucket[0].id,
  name: 'test',
  size: 123123123,
  tree_level: 0,
  type: 'image/jpeg',
  url: 'test',
})

await db.insert(files).values({
  bucket_id: bucket[0].id,
  folder_id: folder[0].id,
  name: 'test',
  size: 12123123,
  tree_level: 1,
  type: 'image/jpeg',
  url: 'test',
})
