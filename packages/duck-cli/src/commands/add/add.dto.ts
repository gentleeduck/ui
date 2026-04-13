import { z } from 'zod'

export const addOptionsSchema = z.object({
  all: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
  force: z.boolean().default(false),
  workspace: z.string().optional(),
  yes: z.boolean().default(false),
})

export const addArgumentsSchema = z.array(z.string()).default([])

export type AddOptions = z.infer<typeof addOptionsSchema>
