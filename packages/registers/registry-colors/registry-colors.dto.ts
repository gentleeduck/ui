import { z } from 'zod'

// 34 design tokens every theme must define.
export const THEME_CSS_VAR_KEYS = [
  // Core (26)
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'warning',
  'warning-foreground',
  // Sidebar (8)
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

export type ThemeCSSVarKey = (typeof THEME_CSS_VAR_KEYS)[number]

export const THEME_NAMES = [
  'zinc',
  'slate',
  'stone',
  'gray',
  'neutral',
  'red',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
  'amber',
  'purple',
  'teal',
] as const

export type ThemeName = (typeof THEME_NAMES)[number]

export const DEFAULT_RADIUS = '0.5rem'

const oklchValueSchema = z.string()

// Drive the shape from THEME_CSS_VAR_KEYS so additions there stay in sync.
const colorSchemeShape = Object.fromEntries(THEME_CSS_VAR_KEYS.map((key) => [key, oklchValueSchema])) as Record<
  ThemeCSSVarKey,
  typeof oklchValueSchema
>

export const themeColorSchemeSchema = z.object(colorSchemeShape)
export type ThemeColorScheme = z.infer<typeof themeColorSchemeSchema>

export const themeEntrySchema = z.object({
  label: z.string(),
  light: themeColorSchemeSchema,
  dark: themeColorSchemeSchema,
  radius: z.string(),
})
export type ThemeEntry = z.infer<typeof themeEntrySchema>

export const themeRegistrySchema = z.record(z.string(), themeEntrySchema)
export type ThemeRegistry = z.infer<typeof themeRegistrySchema>
