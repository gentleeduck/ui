import { z } from 'zod'

export const REGISTRY_ITEM_TYPES = [
  'registry:ui',
  'registry:lib',
  'registry:hook',
  'registry:block',
  'registry:example',
  'registry:internal',
  'registry:page',
] as const

export const registryItemTypeSchema = z.enum(REGISTRY_ITEM_TYPES)

export const registryItemFileSchema = z.object({
  content: z.string().optional(),
  path: z.string(),
  target: z.string().optional(),
  type: registryItemTypeSchema,
})

export type RegistryItemFile = z.infer<typeof registryItemFileSchema>

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    plugins: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
  }),
})

export const registryItemCssVarsSchema = z.object({
  dark: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
})

export const blockChunkSchema = z.object({
  code: z.string().optional(),
  component: z.any(),
  container: z
    .object({
      className: z.string().nullish(),
    })
    .optional(),
  description: z.string(),
  file: z.string(),
  name: z.string(),
})

export const registryEntrySchema = z.object({
  // chunks: z.array(blockChunkSchema).optional(),
  // docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema).optional(),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  source: z.string().optional(),
  tailwind: registryItemTailwindSchema.optional(),
  type: registryItemTypeSchema,
})

export type RegistryEntry = z.infer<typeof registryEntrySchema>

export const registrySchema = z.object({
  blocks: z.array(registryEntrySchema),
  examples: z.array(registryEntrySchema),
  uis: z.array(registryEntrySchema),
  internal: z.array(registryEntrySchema),
  // TODO:
  // pages: z.array(registryEntrySchema),
})

export type Registry = z.infer<typeof registrySchema>

// TEST: NOTE: STILL NOT USED IN REAL
export const blockSchema = registryEntrySchema.extend({
  code: z.string(),
  component: z.any(),
  container: z
    .object({
      className: z.string().nullish(),
      height: z.string().nullish(),
    })
    .optional(),
  highlightedCode: z.string(),
  type: z.literal('registry:block'),
})
export type Block = z.infer<typeof blockSchema>

export type BlockChunk = z.infer<typeof blockChunkSchema>
