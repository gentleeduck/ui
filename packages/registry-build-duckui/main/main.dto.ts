import { z } from 'zod'

export const envSchema = z.object({
  REGISTRY_UI_PATH: z.string(),
  REGISTRY_EXAMPLES_PATH: z.string(),
  REGISTRY_BLOCKS_PATH: z.string(),
  REGISTRY_OUTPUT_PATH: z.string(),
})
export type Env = z.infer<typeof envSchema>
