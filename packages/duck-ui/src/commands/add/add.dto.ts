import { z } from 'zod'

export const add_options_schema = z.object({
  yes: z.boolean().default(false),
  force: z.boolean().default(false),
  registry: z.boolean().default(false),
})

export const add_arguments_schema = z.array(z.string()).default([])

export type addOptions = z.infer<typeof add_options_schema>
