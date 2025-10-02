import { z } from 'zod'

export const init_options_schema = z.object({
  cwd: z.string().default(process.cwd()),
  yes: z.boolean().default(false),
})

export const init_arguments_schema = z.array(z.string()).default([])

export type InitOptions = z.infer<typeof init_options_schema>
