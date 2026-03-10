/**
 * Extension surface.
 *
 * - `extension/` — the runtime contract (`RegistryBuildExtension` interface)
 * - `banner/` — CLI banner output extension
 * - `colors/` — theme CSS and color JSON generation
 * - `component-index/` — framework-specific component loader generation
 * - `validate/` — registry surface integrity validation
 * - `ui/` — UI registry compatibility pack (types, schema, collection helpers,
 *   and extension factories for index-build and components phases)
 */
export * from './banner'
export * from './colors'
export * from './component-index'
export * from './extension'
export * from './ui'
export * from './validate'
