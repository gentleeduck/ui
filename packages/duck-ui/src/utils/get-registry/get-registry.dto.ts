import { z } from 'zod'

export type HSL = `${number} ${number}% ${number}%`
export type Radius = `${number}px` | `${number}rem`

// HSL color schema
export const hsl_schema = z.string() as z.ZodType<HSL>
export const radiusSchema = z.string() as z.ZodType<Radius>

// CSS variables schema
export const css_vars_schema = z.object({
  accent: hsl_schema,
  'accent-foreground': hsl_schema,
  background: hsl_schema,
  border: hsl_schema,
  card: hsl_schema,
  'card-foreground': hsl_schema,
  'chart-1': hsl_schema,
  'chart-2': hsl_schema,
  'chart-3': hsl_schema,
  'chart-4': hsl_schema,
  'chart-5': hsl_schema,
  destructive: hsl_schema,
  'destructive-foreground': hsl_schema,
  foreground: hsl_schema,
  input: hsl_schema,
  muted: hsl_schema,
  'muted-foreground': hsl_schema,
  popover: hsl_schema,
  'popover-foreground': hsl_schema,
  primary: hsl_schema,
  'primary-foreground': hsl_schema,
  radius: radiusSchema,
  ring: hsl_schema,
  secondary: hsl_schema,
  'secondary-foreground': hsl_schema,
})
export type CSSVars = z.infer<typeof css_vars_schema>

export const registrycolor_scheme = z.object({
  activeColor: z.object({
    dark: hsl_schema,
    light: hsl_schema,
  }),
  cssVars: z.object({
    dark: css_vars_schema,
    light: css_vars_schema,
  }),
  label: z.string(),
  name: z.string(),
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
  category: z.string().optional(),
  chunks: z.array(block_chunk_schema).optional(),
  cssVars: registry_item_css_vars_schema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  docs: z.string().optional(),
  files: z.array(registry_item_file_schema).optional(),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  source: z.string().optional(),
  subcategory: z.string().optional(),
  tailwind: registry_item_tailwind_schema.optional(),
  type: registry_item_type_schema,
})

export type RegistryEntry = z.infer<typeof registry_entry_schema>

export const registry_schema = z.array(registry_entry_schema)

export type Registry = z.infer<typeof registry_schema>

//NOTE: STILL NOT USED IN REAL
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
  style: z.enum(['default', 'new-york']),
  type: z.literal('registry:block'),
})

export type Block = z.infer<typeof block_schema>

export type BlockChunk = z.infer<typeof block_chunk_schema>
