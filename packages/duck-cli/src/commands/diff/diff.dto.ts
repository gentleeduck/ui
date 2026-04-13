import { z } from 'zod'

export const diffOptionsSchema = z.object({
  cwd: z.string().default(process.cwd()),
  gui: z.boolean().default(false),
  workspace: z.string().optional(),
})

export const diffArgumentsSchema = z.array(z.string()).default([])

export type DiffOptions = z.infer<typeof diffOptionsSchema>
