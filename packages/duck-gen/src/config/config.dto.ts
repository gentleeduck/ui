import { z } from 'zod'
export const config_schema = z.object({
  extensions: z.object({
    apiRoutes: z.object({
      enabled: z.boolean(),
      globalPrefix: z.string().optional(),
      normalizeAnyToUnknown: z.boolean(),
      outputPath: z.union([z.string(), z.array(z.string())]).optional(),
    }),
    messages: z.object({
      enabled: z.boolean(),
      outputPath: z.union([z.string(), z.array(z.string())]).optional(),
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
