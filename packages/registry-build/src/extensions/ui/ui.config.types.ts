import type { IRegistryEntry, RegistryItemType } from './ui.registry.types'

/**
 * UI-specific config types layered on top of the generic builder config.
 */
export interface IRegistryBuildContentRewrite {
  pattern: string
  replacement: string
}

export type RegistryBuildFramework = 'nextjs' | 'vite' | 'custom'

export interface IRegistryBuildComponentIndex<TType extends RegistryItemType = RegistryItemType> {
  excludeTypes?: TType[]
  framework?: RegistryBuildFramework
  generator?: (items: IRegistryEntry<TType>[]) => string
  header?: string
  ssr?: boolean
}

export interface IRegistryBuildThemeEntry {
  dark: Record<string, string>
  label: string
  light: Record<string, string>
  radius: string
}

export interface IRegistryBuildColorsConfig {
  data?: Record<string, unknown> | string
}

export interface IRegistryBuildThemesConfig {
  cssVarKeys?: string[]
  data?: Record<string, IRegistryBuildThemeEntry> | string
  defaultRadius?: string
  names?: string[]
}

export interface IRegistryBuildCssTemplates {
  baseLayerRules?: string
  baseStyles?: string
}
