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

export const color_scheme = z.object({
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
export type ColorScheme = z.infer<typeof color_scheme>

export const color_base_schema = z.array(color_scheme).min(1, {
  message: 'At least one color scheme is required',
})
export type ColorBase = z.infer<typeof color_base_schema>
