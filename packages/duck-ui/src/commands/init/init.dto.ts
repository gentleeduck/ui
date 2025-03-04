import { z } from 'zod'

export const init_options_schema = z.object({
  yes: z.boolean().default(false),
  defaults: z.boolean().default(false),
  cwd: z.string().default(process.cwd()),
  slint: z.boolean().default(false),
  force: z.boolean().default(false),
  srcDir: z.string().default(process.cwd()),
})

export type InitOptions = z.infer<typeof init_options_schema>
