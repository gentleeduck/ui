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

export { duckCalendarSidebar } from './duck-calendar'
export { duckCliSidebar } from './duck-cli'
export { duckGenSidebar } from './duck-gen'
export { duckHooksSidebar } from './duck-hooks'
export { duckIamSidebar } from './duck-iam'
export { duckLazySidebar } from './duck-lazy'
export { duckLibsSidebar } from './duck-libs'
export { duckMotionSidebar } from './duck-motion'
export { duckPrimitivesSidebar } from './duck-primitives'
export { duckQuerySidebar } from './duck-query'
export { duckRegistryBuildSidebar } from './duck-registry-build'
export { duckShortcutSidebar } from './duck-shortcut'
export { duckStateSidebar } from './duck-state'
export { duckTemplateSidebar } from './duck-template'
export { duckTtestSidebar } from './duck-ttest'
export { duckTtlogSidebar } from './duck-ttlog'
export { duckUiSidebar } from './duck-ui'
export { duckUploadSidebar } from './duck-upload'
export { duckVariantsSidebar } from './duck-variants'
export { duckVimSidebar } from './duck-vim'
export type { ITypedSidebarItem, ITypedSidebarSection } from './types'
export { defineSidebar } from './types'
export { wwwSidebar } from './www'

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
