import { z } from 'zod'

export type HSL = `${number} ${number}% ${number}%`
export type Radius = `${number}px` | `${number}rem`

// HSL color schema
export const hslSchema = z.string() as z.ZodType<HSL>
export const radiusSchema = z.string() as z.ZodType<Radius>

// CSS variables schema
export const cssVarsSchema = z.object({
  accent: hslSchema,
  'accent-foreground': hslSchema,
  background: hslSchema,
  border: hslSchema,
  card: hslSchema,
  'card-foreground': hslSchema,
  'chart-1': hslSchema,
  'chart-2': hslSchema,
  'chart-3': hslSchema,
  'chart-4': hslSchema,
  'chart-5': hslSchema,
  destructive: hslSchema,
  'destructive-foreground': hslSchema,
  foreground: hslSchema,
  input: hslSchema,
  muted: hslSchema,
  'muted-foreground': hslSchema,
  popover: hslSchema,
  'popover-foreground': hslSchema,
  primary: hslSchema,
  'primary-foreground': hslSchema,
  radius: radiusSchema,
  ring: hslSchema,
  secondary: hslSchema,
  'secondary-foreground': hslSchema,
})
export type CSSVars = z.infer<typeof cssVarsSchema>

export const registrycolorScheme = z.object({
  activeColor: z.object({
    dark: hslSchema,
    light: hslSchema,
  }),
  cssVars: z.object({
    dark: cssVarsSchema,
    light: cssVarsSchema,
  }),
  label: z.string(),
  name: z.string(),
})
export type ColorScheme = z.infer<typeof registrycolorScheme>

export const registryColorBaseSchema = z.array(registrycolorScheme).min(1, {
  message: 'At least one color scheme is required',
})
export type ColorBase = z.infer<typeof registryColorBaseSchema>

export const registryItemTypeSchema = z.enum([
  'registry:ui',
  'registry:lib',
  'registry:hook',
  'registry:block',
  'registry:example',
  'registry:internal',
  'registry:page',
])

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
  categories: z.array(z.string()).optional(),
  chunks: z.array(blockChunkSchema).optional(),
  cssVars: registryItemCssVarsSchema.optional(),
  dependencies: z.array(z.string()).optional(),
  description: z.string().optional(),
  devDependencies: z.array(z.string()).optional(),
  docs: z.string().optional(),
  files: z.array(registryItemFileSchema).optional(),
  name: z.string(),
  registryDependencies: z.array(z.string()).optional(),
  root_folder: z.string(),
  source: z.string().optional(),
  tailwind: registryItemTailwindSchema.optional(),
  type: registryItemTypeSchema,
})

export type RegistryEntry = z.infer<typeof registryEntrySchema>

export const registrySchema = z.array(registryEntrySchema)

export type Registry = z.infer<typeof registrySchema>

export type ThemeResponse = {
  name: string
  label?: string
  light: Record<string, string>
  dark: Record<string, string>
  radius?: string
}
