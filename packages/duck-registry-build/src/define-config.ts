import type { IRegistryBuildConfig } from './config/types'

/**
 * Define a registry build configuration with full type inference.
 *
 * The config object drives the entire build pipeline. Users define their
 * collections, sources, and extensions here. The builder provides built-in
 * extensions (via `uiRegistryPreset()`) or users can create their own.
 *
 * @example
 * ```ts
 * import { defineConfig, uiRegistryPreset } from '@gentleduck/registry-build'
 *
 * export default defineConfig({
 *   collections: { ... },
 *   extensions: [...uiRegistryPreset()],
 *   output: { dir: './dist' },
 * })
 * ```
 */
export function defineConfig<const TConfig extends IRegistryBuildConfig>(config: TConfig) {
  return config
}
