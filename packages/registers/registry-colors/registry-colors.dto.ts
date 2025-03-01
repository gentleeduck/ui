import { z } from 'zod'

export type HSL = `${number} ${number}% ${number}%`
export type Radius = `${number}px` | `${number}rem`

// HSL color schema
export const hslSchema = z.string() as z.ZodType<HSL>
export const radiusSchema = z.string() as z.ZodType<Radius>

// CSS variables schema
export const cssVarsSchema = z.object({
  background: hslSchema,
  foreground: hslSchema,
  card: hslSchema,
  'card-foreground': hslSchema,
  popover: hslSchema,
  'popover-foreground': hslSchema,
  primary: hslSchema,
  'primary-foreground': hslSchema,
  secondary: hslSchema,
  'secondary-foreground': hslSchema,
  muted: hslSchema,
  'muted-foreground': hslSchema,
  accent: hslSchema,
  'accent-foreground': hslSchema,
  destructive: hslSchema,
  'destructive-foreground': hslSchema,
  border: hslSchema,
  input: hslSchema,
  ring: hslSchema,
  radius: radiusSchema,
  'chart-1': hslSchema,
  'chart-2': hslSchema,
  'chart-3': hslSchema,
  'chart-4': hslSchema,
  'chart-5': hslSchema,
})
export type CSSVars = z.infer<typeof cssVarsSchema>

export const colorScheme = z.object({
  name: z.string(),
  label: z.string(),
  activeColor: z.object({
    light: hslSchema,
    dark: hslSchema,
  }),
  cssVars: z.object({
    light: cssVarsSchema,
    dark: cssVarsSchema,
  }),
})
export type ColorScheme = z.infer<typeof colorScheme>

export const colorBaseSchema = z.array(colorScheme).min(1, {
  message: 'At least one color scheme is required',
})
export type ColorBase = z.infer<typeof colorBaseSchema>
