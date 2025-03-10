import { z } from 'zod'

export const registry_item_type_schema = z.enum([
  'registry:style',
  'registry:lib',
  'registry:example',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
])

export const registry_item_file_schema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registry_item_type_schema,
  target: z.string().optional(),
})

export type RegistryItemFile = z.infer<typeof registry_item_file_schema>

export const registry_item_tailwind_schema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    theme: z.record(z.string(), z.any()).optional(),
    plugins: z.array(z.string()).optional(),
  }),
})

export const registry_item_css_vars_schema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

export const block_chunk_schema = z.object({
  name: z.string(),
  description: z.string(),
  component: z.any(),
  file: z.string(),
  code: z.string().optional(),
  container: z
    .object({
      className: z.string().nullish(),
    })
    .optional(),
})

export const registry_entry_schema = z.object({
  name: z.string(),
  type: registry_item_type_schema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  files: z.array(registry_item_file_schema).optional(),
  tailwind: registry_item_tailwind_schema.optional(),
  cssVars: registry_item_css_vars_schema.optional(),
  source: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  chunks: z.array(block_chunk_schema).optional(),
  docs: z.string().optional(),
})

export type RegistryEntry = z.infer<typeof registry_entry_schema>

export const registry_schema = z.array(registry_entry_schema)

export type Registry = z.infer<typeof registry_schema>

//NOTE: STILL NOT USED IN REAL
export const block_schema = registry_entry_schema.extend({
  type: z.literal('registry:block'),
  style: z.enum(['default', 'new-york']),
  component: z.any(),
  container: z
    .object({
      height: z.string().nullish(),
      className: z.string().nullish(),
    })
    .optional(),
  code: z.string(),
  highlightedCode: z.string(),
})

export type Block = z.infer<typeof block_schema>

export type BlockChunk = z.infer<typeof block_chunk_schema>
