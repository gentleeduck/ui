import { z } from 'zod'

export const REGISTRY_ITEM_TYPES = [
  'registry:ui',
  'registry:lib',
  'registry:hook',
  'registry:block',
  'registry:example',
  'registry:page',
] as const

export const registry_item_type_schema = z.enum(REGISTRY_ITEM_TYPES)

export const registry_item_file_schema = z.object({
  content: z.string().optional(),
  path: z.string(),
  target: z.string().optional(),
  type: registry_item_type_schema,
})

export type RegistryItemFile = z.infer<typeof registry_item_file_schema>

export const registry_item_tailwind_schema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    plugins: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
  }),
})

export const registry_item_css_vars_schema = z.object({
  dark: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
})

export const block_chunk_schema = z.object({
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

export const registry_entry_schema = z.object({
  // chunks: z.array(block_chunk_schema).optional(),
  // docs: z.string().optional(),
  categories: z.array(z.string()).optional(),
  cssVars: registry_item_css_vars_schema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  files: z.array(registry_item_file_schema).optional(),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  source: z.string().optional(),
  tailwind: registry_item_tailwind_schema.optional(),
  type: registry_item_type_schema,
})

export type RegistryEntry = z.infer<typeof registry_entry_schema>

export const registry_schema = z.object({
  blocks: z.array(registry_entry_schema),
  examples: z.array(registry_entry_schema),
  uis: z.array(registry_entry_schema),
  //
  // pages: z.array(registry_entry_schema),
})

export type Registry = z.infer<typeof registry_schema>

// TEST: NOTE: STILL NOT USED IN REAL
export const block_schema = registry_entry_schema.extend({
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
export type Block = z.infer<typeof block_schema>

export type BlockChunk = z.infer<typeof block_chunk_schema>
