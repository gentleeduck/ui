/**
 * @gentleduck/registry-build
 *
 * A generic, extension-driven build system for component registries.
 *
 * Users define their config with `defineConfig()`, register extensions
 * (custom or built-in), and the builder runs them in order. The package
 * provides built-in extensions for UI registries via `uiRegistryPreset()`.
 *
 * @example
 * ```ts
 * // Generic usage (custom extensions only)
 * import { defineConfig } from '@gentleduck/registry-build'
 *
 * export default defineConfig({
 *   collections: { ... },
 *   extensions: [myExtension()],
 *   output: { dir: './dist' },
 * })
 * ```
 *
 * @example
 * ```ts
 * // UI registry usage (built-in extensions)
 * import { defineConfig, uiRegistryPreset } from '@gentleduck/registry-build'
 *
 * export default defineConfig({
 *   extensions: [...uiRegistryPreset({ colors: { ... } })],
 *   output: { dir: './dist' },
 *   registries: { ... },
 *   sources: { ... },
 * })
 * ```
 */
export * from './adapters/index'
export * from './commands/index'
export * from './config/index'
export * from './define-config'
export * from './extensions/index'
export * from './lib/index'
export * from './main/index'
export * from './pipeline/index'
