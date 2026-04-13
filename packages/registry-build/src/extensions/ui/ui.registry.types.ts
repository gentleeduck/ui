import type { IRegistryFileTreeNode } from '../../lib/file-tree'

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
export interface IRegistryItemFile<TType extends RegistryItemType = RegistryItemType> {
  content?: string
  path: string
  target?: string
  type: TType
}

/**
 * Tailwind config fragment attached to an entry.
 */
export interface IRegistryItemTailwindConfig {
  content?: string[]
  plugins?: string[]
  theme?: Record<string, unknown>
}

export interface IRegistryItemTailwind {
  config: IRegistryItemTailwindConfig
}

export interface IRegistryItemCssVars {
  dark?: Record<string, string>
  light?: Record<string, string>
}

/**
 * UI registry entry shape used by the built-in UI extensions.
 */
export interface IRegistryEntry<TType extends RegistryItemType = RegistryItemType> {
  categories?: string[]
  cssVars?: IRegistryItemCssVars
  dependencies?: string[]
  description?: string
  devDependencies?: string[]
  files?: IRegistryItemFile<TType>[]
  name: string
  registryDependencies?: string[]
  root_folder: string
  source?: string
  tailwind?: IRegistryItemTailwind
  type: TType
  [key: string]: unknown
}

export interface IIndexedRegistryEntry<TType extends RegistryItemType = RegistryItemType> extends IRegistryEntry<TType> {
  source?: string
  tree?: IRegistryFileTreeNode[]
}
