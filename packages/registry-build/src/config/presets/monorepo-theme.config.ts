import { registry_colors, themeRegistry } from '@gentleduck/registers'
import { defineConfig } from '../../define-config'

export const MONOREPO_THEME_CSS_VAR_KEYS = [
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
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

export const MONOREPO_THEME_NAMES = [
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

export const monorepoThemePreset = defineConfig({
  colors: {
    data: registry_colors,
  },
  themes: {
    cssVarKeys: [...MONOREPO_THEME_CSS_VAR_KEYS],
    data: themeRegistry,
    names: [...MONOREPO_THEME_NAMES],
  },
})

export default monorepoThemePreset
