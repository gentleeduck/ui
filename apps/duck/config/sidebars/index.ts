/**
 * Per-package sidebar configs.
 *
 * Each duck-* package has a hand-curated `<pkg>.constants.ts` file that
 * declares its sidebar links with literal `href` types. Slug pages import
 * the constant directly instead of generating one from velite at runtime.
 *
 * Add a new package by creating `apps/duck/config/sidebars/<pkg>.constants.ts`
 * and re-exporting it here.
 */

import { duckCalendarSidebar } from './duck-calendar.constants'
import { duckCliSidebar } from './duck-cli.constants'
import { duckGenSidebar } from './duck-gen.constants'
import { duckHooksSidebar } from './duck-hooks.constants'
import { duckIamSidebar } from './duck-iam.constants'
import { duckLazySidebar } from './duck-lazy.constants'
import { duckLibsSidebar } from './duck-libs.constants'
import { duckMotionSidebar } from './duck-motion.constants'
import { duckPrimitivesSidebar } from './duck-primitives.constants'
import { duckQuerySidebar } from './duck-query.constants'
import { duckRegistryBuildSidebar } from './duck-registry-build.constants'
import { duckShortcutSidebar } from './duck-shortcut.constants'
import { duckStateSidebar } from './duck-state.constants'
import { duckTemplateSidebar } from './duck-template.constants'
import { duckTtestSidebar } from './duck-ttest.constants'
import { duckTtlogSidebar } from './duck-ttlog.constants'
import { duckUiSidebar } from './duck-ui.constants'
import { duckUploadSidebar } from './duck-upload.constants'
import { duckVariantsSidebar } from './duck-variants.constants'
import { duckVimSidebar } from './duck-vim.constants'

export { type DuckCalendarHref, duckCalendarSidebar } from './duck-calendar.constants'
export { type DuckCliHref, duckCliSidebar } from './duck-cli.constants'
export { type DuckGenHref, duckGenSidebar } from './duck-gen.constants'
export { type DuckHooksHref, duckHooksSidebar } from './duck-hooks.constants'
export { type DuckIamHref, duckIamSidebar } from './duck-iam.constants'
export { type DuckLazyHref, duckLazySidebar } from './duck-lazy.constants'
export { type DuckLibsHref, duckLibsSidebar } from './duck-libs.constants'
export { type DuckMotionHref, duckMotionSidebar } from './duck-motion.constants'
export { type DuckPrimitivesHref, duckPrimitivesSidebar } from './duck-primitives.constants'
export { type DuckQueryHref, duckQuerySidebar } from './duck-query.constants'
export { type DuckRegistryBuildHref, duckRegistryBuildSidebar } from './duck-registry-build.constants'
export { type DuckShortcutHref, duckShortcutSidebar } from './duck-shortcut.constants'
export { type DuckStateHref, duckStateSidebar } from './duck-state.constants'
export { type DuckTemplateHref, duckTemplateSidebar } from './duck-template.constants'
export { type DuckTtestHref, duckTtestSidebar } from './duck-ttest.constants'
export { type DuckTtlogHref, duckTtlogSidebar } from './duck-ttlog.constants'
export { type DuckUiHref, duckUiSidebar } from './duck-ui.constants'
export { type DuckUploadHref, duckUploadSidebar } from './duck-upload.constants'
export { type DuckVariantsHref, duckVariantsSidebar } from './duck-variants.constants'
export { type DuckVimHref, duckVimSidebar } from './duck-vim.constants'
export type { ITypedSidebarItem, ITypedSidebarSection } from './types'
export { defineSidebar } from './types'
export { type WwwHref, wwwSidebar } from './www.constants'

/**
 * Map of every package slug -> typed sidebar config.
 * Used by the global command palette and search-index builder.
 */
export const packageSidebars = {
  'duck-calendar': duckCalendarSidebar,
  'duck-cli': duckCliSidebar,
  'duck-gen': duckGenSidebar,
  'duck-hooks': duckHooksSidebar,
  'duck-iam': duckIamSidebar,
  'duck-lazy': duckLazySidebar,
  'duck-libs': duckLibsSidebar,
  'duck-motion': duckMotionSidebar,
  'duck-primitives': duckPrimitivesSidebar,
  'duck-query': duckQuerySidebar,
  'duck-registry-build': duckRegistryBuildSidebar,
  'duck-shortcut': duckShortcutSidebar,
  'duck-state': duckStateSidebar,
  'duck-template': duckTemplateSidebar,
  'duck-ttest': duckTtestSidebar,
  'duck-ttlog': duckTtlogSidebar,
  'duck-ui': duckUiSidebar,
  'duck-upload': duckUploadSidebar,
  'duck-variants': duckVariantsSidebar,
  'duck-vim': duckVimSidebar,
} as const
