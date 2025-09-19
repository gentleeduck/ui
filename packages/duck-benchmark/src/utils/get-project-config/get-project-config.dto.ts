import { z } from 'zod'

export const raw_config_schema = z
  .object({
    out_dir: z.string().optional().default('duck_benchmark'),
    show_log: z.boolean().default(false).optional(),
    src: z.string(),
  })
  .strict()

export type RawConfigType = z.infer<typeof raw_config_schema>
