import { z } from 'zod'

export const diff_options_schema = z.object({
  cwd: z.string().default(process.cwd()),
  gui: z.boolean().default(false),
  workspace: z.string().optional(),
})

export const diff_arguments_schema = z.array(z.string()).default([])

export type DiffOptions = z.infer<typeof diff_options_schema>
