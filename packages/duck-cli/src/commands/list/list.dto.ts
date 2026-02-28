import { z } from 'zod'

export const list_options_schema = z.object({
  json: z.boolean().default(false),
  type: z.string().default(''),
})

export type ListOptions = z.infer<typeof list_options_schema>
