import { z } from 'zod'

export const remove_options_schema = z.object({
  cwd: z.string().default(process.cwd()),
  workspace: z.string().optional(),
  yes: z.boolean().default(false),
})

export const remove_arguments_schema = z.array(z.string()).default([])

export type RemoveOptions = z.infer<typeof remove_options_schema>
