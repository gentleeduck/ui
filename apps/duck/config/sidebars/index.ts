/**
 * Per-package sidebar configs.
 *
 * Each duck-* package has a hand-curated `<pkg>.ts` file that declares
 * its sidebar links with literal `href` types. Slug pages import the
 * constant directly instead of generating one from velite at runtime.
 *
 * Add a new package by creating `apps/duck/config/sidebars/<pkg>.ts`
 * and re-exporting it here.
 */

import { duckCalendarSidebar } from './duck-calendar'
import { duckCliSidebar } from './duck-cli'
import { duckGenSidebar } from './duck-gen'
import { duckHooksSidebar } from './duck-hooks'
import { duckIamSidebar } from './duck-iam'
import { duckLazySidebar } from './duck-lazy'
import { duckLibsSidebar } from './duck-libs'
import { duckMotionSidebar } from './duck-motion'
import { duckPrimitivesSidebar } from './duck-primitives'
import { duckQuerySidebar } from './duck-query'
import { duckRegistryBuildSidebar } from './duck-registry-build'
import { duckShortcutSidebar } from './duck-shortcut'
import { duckStateSidebar } from './duck-state'
import { duckTemplateSidebar } from './duck-template'
import { duckTtestSidebar } from './duck-ttest'
import { duckTtlogSidebar } from './duck-ttlog'
import { duckUiSidebar } from './duck-ui'
import { duckUploadSidebar } from './duck-upload'
import { duckVariantsSidebar } from './duck-variants'
import { duckVimSidebar } from './duck-vim'

export { type DuckCalendarHref, duckCalendarSidebar } from './duck-calendar'
export { type DuckCliHref, duckCliSidebar } from './duck-cli'
export { type DuckGenHref, duckGenSidebar } from './duck-gen'
export { type DuckHooksHref, duckHooksSidebar } from './duck-hooks'
export { type DuckIamHref, duckIamSidebar } from './duck-iam'
export { type DuckLazyHref, duckLazySidebar } from './duck-lazy'
export { type DuckLibsHref, duckLibsSidebar } from './duck-libs'
export { type DuckMotionHref, duckMotionSidebar } from './duck-motion'
export { type DuckPrimitivesHref, duckPrimitivesSidebar } from './duck-primitives'
export { type DuckQueryHref, duckQuerySidebar } from './duck-query'
export { type DuckRegistryBuildHref, duckRegistryBuildSidebar } from './duck-registry-build'
export { type DuckShortcutHref, duckShortcutSidebar } from './duck-shortcut'
export { type DuckStateHref, duckStateSidebar } from './duck-state'
export { type DuckTemplateHref, duckTemplateSidebar } from './duck-template'
export { type DuckTtestHref, duckTtestSidebar } from './duck-ttest'
export { type DuckTtlogHref, duckTtlogSidebar } from './duck-ttlog'
export { type DuckUiHref, duckUiSidebar } from './duck-ui'
export { type DuckUploadHref, duckUploadSidebar } from './duck-upload'
export { type DuckVariantsHref, duckVariantsSidebar } from './duck-variants'
export { type DuckVimHref, duckVimSidebar } from './duck-vim'
export type { ITypedSidebarItem, ITypedSidebarSection } from './types'
export { defineSidebar } from './types'
export { type WwwHref, wwwSidebar } from './www'

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
