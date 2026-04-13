import { z } from 'zod'

export const listOptionsSchema = z.object({
  json: z.boolean().default(false),
  type: z.string().default(''),
})

export type ListOptions = z.infer<typeof listOptionsSchema>
