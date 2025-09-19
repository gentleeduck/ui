import { z } from 'zod'

export const init_options_schema = z.object({
  cwd: z.string().default(process.cwd()),
  defaults: z.boolean().default(false),
  force: z.boolean().default(false),
  slint: z.boolean().default(false),
  srcDir: z.string().default(process.cwd()),
  yes: z.boolean().default(false),
})

export type InitOptions = z.infer<typeof init_options_schema>
