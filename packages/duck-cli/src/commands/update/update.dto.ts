import { z } from 'zod'

export const updateOptionsSchema = z.object({
  all: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
  workspace: z.string().optional(),
  yes: z.boolean().default(false),
})

export const updateArgumentsSchema = z.array(z.string()).default([])

export type UpdateOptions = z.infer<typeof updateOptionsSchema>
