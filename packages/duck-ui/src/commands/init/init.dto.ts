import { z } from 'zod'

export const init_options_schema = z.object({
  yes: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
})

export const init_arguments_schema = z.array(z.string()).default([])

export type InitOptions = z.infer<typeof init_options_schema>
