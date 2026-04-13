import { z } from 'zod'

export const removeOptionsSchema = z.object({
  cwd: z.string().default(process.cwd()),
  workspace: z.string().optional(),
  yes: z.boolean().default(false),
})

export const removeArgumentsSchema = z.array(z.string()).default([])

export type RemoveOptions = z.infer<typeof removeOptionsSchema>
