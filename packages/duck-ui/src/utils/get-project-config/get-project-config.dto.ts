import { z } from 'zod'

export const raw_config_schema = z
  .object({
    $schema: z.string().optional(),
    style: z.string(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    tailwind: z.object({
      config: z.string(),
      css: z.string(),
      baseColor: z.string(),
      cssVariables: z.boolean().default(true),
      prefix: z.string().default('').optional(),
    }),
    aliases: z.object({
      components: z.string(),
      hooks: z.string().optional(),
      pages: z.string().optional(),
      utils: z.string(),
      lib: z.string().optional(),
      ui: z.string().optional(),
    }),
  })
  .strict()

export type RawConfigType = z.infer<typeof raw_config_schema>

export const config_cchema = raw_config_schema.extend({
  resolvedPaths: z.object({
    tailwindConfig: z.string(),
    tailwindCss: z.string(),
    utils: z.string(),
    components: z.string(),
    ui: z.string(),
  }),
})
