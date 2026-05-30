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

// Tailwind `theme` values are flat strings (`'#000'`, `'hsl(...)'`) or
// nested scales (`{ 50: '#…', 100: '#…' }`). Anything beyond two levels is
// rejected at parse time — keeps the contract auditable.
const tailwindThemeValueSchema: z.ZodType<string | Record<string, string>> = z.union([
  z.string(),
  z.record(z.string(), z.string()),
])

export const registryItemTailwindSchema = z.object({
  config: z.object({
    content: z.array(z.string()).optional(),
    plugins: z.array(z.string()).optional(),
    theme: z.record(z.string(), tailwindThemeValueSchema).optional(),
  }),
})

export const registryItemCssVarsSchema = z.object({
  dark: z.record(z.string(), z.string()).optional(),
  light: z.record(z.string(), z.string()).optional(),
})

export const blockChunkSchema = z.object({
  code: z.string().optional(),
  // Concrete React element/component injected by the build pipeline.
  // `unknown` forces narrowing at the call site (`as React.ComponentType`).
  component: z.unknown(),
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
  categories: z.array(z.string()).optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  // Required: every entry must declare a `files` array. The build pipeline
  // populates it from the on-disk source — an `undefined` here is a contract
  // bug, not a "no files" signal (use `[]` for that). See pass-1 audit T4.
  files: z.array(registryItemFileSchema),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  tailwind: registryItemTailwindSchema.optional(),
  type: registryItemTypeSchema,
})

export type RegistryEntry = z.infer<typeof registryEntrySchema>

export const registrySchema = z.object({
  blocks: z.array(registryEntrySchema),
  examples: z.array(registryEntrySchema),
  uis: z.array(registryEntrySchema),
  internal: z.array(registryEntrySchema),
})

export type Registry = z.infer<typeof registrySchema>

export const blockSchema = registryEntrySchema.extend({
  code: z.string(),
  // See `blockChunkSchema.component` — `unknown` keeps the contract honest.
  component: z.unknown(),
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
