import { z } from 'zod'
export const config_schema = z.object({
  extensions: z.object({
    apiRoutes: z.object({
      enabled: z.boolean(),
      globalPrefix: z.string().optional(),
      normalizeAnyToUnknown: z.boolean(),
    }),
    messages: z.object({
      enabled: z.boolean(),
    }),
    shared: z.object({
      includeNodeModules: z.boolean(),
      sourceGlobs: z.array(z.string()).optional(),
      tsconfigPath: z.string().optional(),
    }),
  }),
  framework: z.enum(['nestjs']),
})

export type DuckGenConfig = z.infer<typeof config_schema>
