import { z } from 'zod'

export const raw_config_schema = z
  .object({
    src: z.string(),
    out_dir: z.string().optional().default('duck_benchmark'),
    show_log: z.boolean().default(false).optional(),
  })
  .strict()

export type RawConfigType = z.infer<typeof raw_config_schema>
