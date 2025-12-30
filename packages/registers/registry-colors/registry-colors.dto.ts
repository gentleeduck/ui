import { z } from 'zod'

// HSL color schema
export const hsl_schema = z.string()
export const radiusSchema = z.string()

// CSS variables schema
export const css_vars_schema = z
  .object({
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
    warning: hsl_schema,
    'warning-foreground': hsl_schema,
  })
  .catchall(z.string())
export type CSSVars = z.infer<typeof css_vars_schema>

export const color_scheme = z.object({
  activeColor: z
    .object({
      dark: hsl_schema,
      light: hsl_schema,
    })
    .optional(),
  // This will be used for themes not base_colors
  css: z
    .object({
      '@layer base': z.record(z.string(), z.record(z.string(), z.string())).optional(),
    })
    .optional(),
  cssVars: z.object({
    dark: css_vars_schema.omit({ radius: true }),
    light: css_vars_schema,
    // This will be used for themes not base_colors
    theme: z.record(z.string(), z.string()).optional(),
  }),
  label: z.string().optional(),
  name: z.string(),
})
export type ColorScheme = z.infer<typeof color_scheme>

export const color_base_schema = z.array(color_scheme).min(1, {
  message: 'At least one color scheme is required',
})
export type ColorBase = z.infer<typeof color_base_schema>
