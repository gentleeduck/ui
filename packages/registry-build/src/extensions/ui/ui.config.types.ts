import type { RegistryEntry, RegistryItemType } from './ui.registry.types'

/**
 * UI-specific config types layered on top of the generic builder config.
 */
export interface RegistryBuildContentRewrite {
  pattern: string
  replacement: string
}

export type RegistryBuildFramework = 'nextjs' | 'vite' | 'custom'

export interface RegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType> {
  excludeTypes?: TType[]
  framework?: RegistryBuildFramework
  generator?: (items: RegistryEntry<TType>[]) => string
  header?: string
  ssr?: boolean
}

export interface RegistryBuildThemeEntry {
  dark: Record<string, string>
  label: string
  light: Record<string, string>
  radius: string
}

export interface RegistryBuildColorsConfig {
  data?: Record<string, unknown> | string
}

export interface RegistryBuildThemesConfig {
  cssVarKeys?: string[]
  data?: Record<string, RegistryBuildThemeEntry> | string
  defaultRadius?: string
  names?: string[]
}

export interface RegistryBuildCssTemplates {
  baseLayerRules?: string
  baseStyles?: string
}
