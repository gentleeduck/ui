import { z } from 'zod'

export const logSchema = z.object({
  data: z.record(z.string()),
  event: z.enum(['copy_primitive']),
})
