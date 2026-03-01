import { z } from 'zod'

export const add_options_schema = z.object({
  all: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
  force: z.boolean().default(false),
  workspace: z.string().optional(),
  yes: z.boolean().default(false),
})

export const add_arguments_schema = z.array(z.string()).default([])

export type addOptions = z.infer<typeof add_options_schema>
