import { z } from 'zod'

export const add_options_schema = z.object({
  yes: z.boolean().default(false),
})

export type addOptions = z.infer<typeof add_options_schema>
