import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from 'dotenv'
import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { renderTrpcPanel } from 'trpc-panel'
import { createTRPCContext, createTRPCRouter } from './globals'
import { uploadRouter } from './upload'
import { db } from './drizzle'
import { buckets, files, folders, users } from './drizzle'
import { uuid } from 'drizzle-orm/pg-core'
import { ENV } from './globals'

config({ path: './.env' })
const app = new Hono()

// CORS
app.use(cors({ origin: '*' }))

// DOTENV CONFIG

// TRPC ROUTER
export const appRouter = createTRPCRouter({
  upload: uploadRouter,
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

// @ts-ignore: trpcServer is not typed
app.use('/panel', c => {
  const panelHTML = renderTrpcPanel(appRouter, {
    url: 'http://localhost:4050/trpc',
  })
  return c.html(panelHTML)
})

serve(
  {
    port: 4050,
    fetch: app.fetch,
  },
  () => {
    console.log(`API: Listening on port ${4050}`)
    console.log(`TRPC: http://localhost:${4050}/trpc`)
    console.log(`TRPC_PANEL: http://localhost:${4050}/panel`)
  }
)
// const user = await db
//   .insert(users)
//   .values({
//     name: 'wildduck',
//     email: 'duckui@duck.com',
//     password: 'wildduck',
//   })
//   .returning({ id: users.id })
//
// const bucket = await db
//   .insert(buckets)
//   .values({
//     name: 'test',
//     description: 'test',
//     user_id: user[0].id,
//   })
//   .returning({ id: buckets.id })
//
// const folder = await db
//   .insert(folders)
//   .values({
//     name: 'test',
//     tree_level: 0,
//     bucket_id: bucket[0].id,
//   })
//   .returning({ id: folders.id })
//
// await db.insert(files).values({
//   name: 'test',
//   size: 123123123,
//   url: 'test',
//   type: 'image/jpeg',
//   tree_level: 0,
//   bucket_id: bucket[0].id,
// })
//
// await db.insert(files).values({
//   name: 'test',
//   size: 12123123,
//   url: 'test',
//   tree_level: 1,
//   folder_id: folder[0].id,
//   bucket_id: bucket[0].id,
// })

console.log(process.env.POSTGRES_HOST)
