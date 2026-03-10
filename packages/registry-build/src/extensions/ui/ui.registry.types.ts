import type { RegistryFileTreeNode } from '../../lib/file-tree'

/**
 * Core registry item types owned by the UI compatibility module.
 */
export type RegistryItemType = `registry:${string}`

/**
 * Convenient map shape for values keyed by UI registry item type.
 */
export type RegistryItemTypeMap<TValue, TType extends RegistryItemType = RegistryItemType> = Partial<
  Record<TType, TValue>
>

/**
 * A source file that belongs to a UI registry entry.
 */
export interface RegistryItemFile<TType extends RegistryItemType = RegistryItemType> {
  content?: string
  path: string
  target?: string
  type: TType
}

/**
 * Tailwind config fragment attached to an entry.
 */
export interface RegistryItemTailwindConfig {
  content?: string[]
  plugins?: string[]
  theme?: Record<string, unknown>
}

export interface RegistryItemTailwind {
  config: RegistryItemTailwindConfig
}

export interface RegistryItemCssVars {
  dark?: Record<string, string>
  light?: Record<string, string>
}

/**
 * UI registry entry shape used by the built-in UI extensions.
 */
export interface RegistryEntry<TType extends RegistryItemType = RegistryItemType> {
  categories?: string[]
  cssVars?: RegistryItemCssVars
  dependencies?: string[]
  description?: string
  devDependencies?: string[]
  files?: RegistryItemFile<TType>[]
  name: string
  registryDependencies?: string[]
  root_folder: string
  source?: string
  tailwind?: RegistryItemTailwind
  type: TType
  [key: string]: unknown
}

export interface IndexedRegistryEntry<TType extends RegistryItemType = RegistryItemType> extends RegistryEntry<TType> {
  source?: string
  tree?: RegistryFileTreeNode[]
}
