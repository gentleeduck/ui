import { EventEmitter } from 'events'
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { z } from 'zod'
// create a global event emitter (could be replaced by redis, etc)
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws'

export const createWSContext = async (opts: CreateWSSContextFnOptions) => {
  const token = opts.info.connectionParams?.token

  console.log(token)

  // [... authenticate]

  return {}
}

export type WSContext = Awaited<ReturnType<typeof createWSContext>>
