import { bannerExtension } from '../../extensions/banner'
import type { IRegistryBuildBannerExtensionOptions } from '../../extensions/banner/banner.types'
import { colorsExtension } from '../../extensions/colors'
import type { RegistryBuildColorsExtensionOptions } from '../../extensions/colors/colors.types'
import { componentIndexExtension } from '../../extensions/component-index'
import type { RegistryBuildComponentIndexExtensionOptions } from '../../extensions/component-index/component-index.types'
import type { IRegistryBuildExtension } from '../../extensions/extension'
import { componentsExtension, indexBuildExtension } from '../../extensions/ui/ui.extensions'
import { validateExtension } from '../../extensions/validate'

/**
 * Options for the UI registry preset.
 *
 * Each key toggles or configures a built-in extension. Set a key to `false`
 * to exclude that extension entirely.
 */
export interface IUiRegistryPresetOptions {
  /** Show the CLI banner before the build. Default: `true`. */
  banner?: false | IRegistryBuildBannerExtensionOptions
  /** Generate theme CSS and color JSON outputs. Default: `false`. */
  colors?: false | RegistryBuildColorsExtensionOptions
  /** Generate a framework-specific component loader file. Default: `false`. */
  componentIndex?: false | RegistryBuildComponentIndexExtensionOptions
  /** Process indexed entries into JSON component payloads. Default: `true`. */
  components?: boolean
  /** Materialize registry entries from sources into `index.json`. Default: `true`. */
  index?: boolean
  /** Validate the registry surface before building. Default: `true`. */
  validate?: boolean
}

/**
 * Returns the standard set of extensions for building a UI component registry.
 *
 * This preset bundles the built-in extensions (banner, validate, index-build,
 * components) and optional extensions (colors, component-index) into a single
 * array that can be spread into `defineConfig({ extensions })`.
 *
 * @example
 * ```ts
 * import { defineConfig, uiRegistryPreset } from '@gentleduck/registry-build'
 *
 * export default defineConfig({
 *   extensions: [
 *     ...uiRegistryPreset({ colors: { themes: { data: './themes.json' } } }),
 *   ],
 *   // ...
 * })
 * ```
 */
export function uiRegistryPreset(options: IUiRegistryPresetOptions = {}): IRegistryBuildExtension[] {
  const extensions: IRegistryBuildExtension[] = []

  if (options.banner !== false) {
    extensions.push(bannerExtension(options.banner || {}))
  }

  if (options.validate !== false) {
    extensions.push(validateExtension())
  }

  if (options.index !== false) {
    extensions.push(indexBuildExtension())
  }

  if (options.components !== false) {
    extensions.push(componentsExtension())
  }

  if (options.colors) {
    extensions.push(colorsExtension(options.colors))
  }

  if (options.componentIndex) {
    extensions.push(componentIndexExtension(options.componentIndex))
  }

  return extensions
}
