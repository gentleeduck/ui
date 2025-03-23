import { z } from 'zod'

export type HSL = `${number} ${number}% ${number}%`
export type Radius = `${number}px` | `${number}rem`

// HSL color schema
export const hsl_schema = z.string() as z.ZodType<HSL>
export const radiusSchema = z.string() as z.ZodType<Radius>

// CSS variables schema
export const css_vars_schema = z.object({
  background: hsl_schema,
  foreground: hsl_schema,
  card: hsl_schema,
  'card-foreground': hsl_schema,
  popover: hsl_schema,
  'popover-foreground': hsl_schema,
  primary: hsl_schema,
  'primary-foreground': hsl_schema,
  secondary: hsl_schema,
  'secondary-foreground': hsl_schema,
  muted: hsl_schema,
  'muted-foreground': hsl_schema,
  accent: hsl_schema,
  'accent-foreground': hsl_schema,
  destructive: hsl_schema,
  'destructive-foreground': hsl_schema,
  border: hsl_schema,
  input: hsl_schema,
  ring: hsl_schema,
  radius: radiusSchema,
  'chart-1': hsl_schema,
  'chart-2': hsl_schema,
  'chart-3': hsl_schema,
  'chart-4': hsl_schema,
  'chart-5': hsl_schema,
})
export type CSSVars = z.infer<typeof css_vars_schema>

export const registrycolor_scheme = z.object({
  name: z.string(),
  label: z.string(),
  activeColor: z.object({
    light: hsl_schema,
    dark: hsl_schema,
  }),
  cssVars: z.object({
    light: css_vars_schema,
    dark: css_vars_schema,
  }),
})
export type ColorScheme = z.infer<typeof registrycolor_scheme>

export const registry_color_base_schema = z.array(registrycolor_scheme).min(1, {
  message: 'At least one color scheme is required',
})
export type ColorBase = z.infer<typeof registry_color_base_schema>

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
