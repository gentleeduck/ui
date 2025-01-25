import EventEmitter, { on } from 'events'
import { tracked } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from './globals'
import { observable } from '@trpc/server/observable'

export const ee = new EventEmitter()

export const ws_router = createTRPCRouter({
  onPostAdd: publicProcedure
    .input(
      z
        .object({
          // lastEventId is the last event id that the client has received
          // On the first call, it will be whatever was passed in the initial setup
          // If the client reconnects, it will be the last event id that the client received
          lastEventId: z.string().nullish(),
        })
        .optional()
    )
    .subscription(async function* (opts) {
      if (opts.input?.lastEventId) {
        // [...] get the posts since the last event id and yield them
      }
      // listen for new events
      for await (const [data] of on(ee, 'add', {
        // Passing the AbortSignal from the request automatically cancels the event emitter when the subscription is aborted
        signal: opts.signal,
      })) {
        const post = data
        // tracking the post id ensures the client can reconnect at any time and get the latest events this id
        yield tracked(post.id, post)
      }
    }),
  randomNumber: publicProcedure.subscription(() => {
    return observable<number>(emit => {
      const onRandomNumber = (randomNumber: number) => {
        emit.next(randomNumber) // Send the random number to the client
      }

      // Listen for the "randomNumber" event
      ee.on('randomNumber', onRandomNumber)

      // Cleanup when the client unsubscribes
      return () => {
        ee.off('randomNumber', onRandomNumber)
      }
    })
  }),
})
