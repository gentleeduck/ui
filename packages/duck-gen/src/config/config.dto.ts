import { z } from 'zod'

const output_source_schema = z.union([z.string(), z.array(z.string())]).optional()

export const config_schema = z.object({
  extensions: z.object({
    apiRoutes: z.object({
      enabled: z.boolean(),
      globalPrefix: z.string().optional(),
      includeNodeModules: z.boolean().optional(),
      normalizeAnyToUnknown: z.boolean(),
      outputSource: output_source_schema,
      outputPath: z.string().optional(),
      sourceGlobs: z.array(z.string()).optional(),
      tsconfigPath: z.string().optional(),
    }),
    messages: z.object({
      enabled: z.boolean(),
      includeNodeModules: z.boolean().optional(),
      outputSource: output_source_schema,
      outputPath: z.string().optional(),
      sourceGlobs: z.array(z.string()).optional(),
      tsconfigPath: z.string().optional(),
    }),
    shared: z.object({
      includeNodeModules: z.boolean(),
      outputSource: output_source_schema,
      sourceGlobs: z.array(z.string()).optional(),
      tsconfigPath: z.string().optional(),
    }),
  }),
  framework: z.enum(['nestjs']),
})

export type DuckGenConfig = z.infer<typeof config_schema>
