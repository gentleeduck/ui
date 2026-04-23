import { z } from 'zod'

export const rawConfigSchema = z
  .object({
    outDir: z.string().optional().default('duck_benchmark'),
    showLog: z.boolean().default(false).optional(),
    src: z.string(),
  })
  .strict()

export type RawConfigType = z.infer<typeof rawConfigSchema>
