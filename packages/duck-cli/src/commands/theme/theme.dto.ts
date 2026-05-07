import { z } from 'zod'

export const themeOptionsSchema = z.object({
  json: z.boolean().default(false),
  css: z.string().default(''),
})

export type ThemeOptions = z.infer<typeof themeOptionsSchema>
