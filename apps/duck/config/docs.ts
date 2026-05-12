import type { IDocsConfig } from '@gentleduck/docs/context'
import searchIndex from '~/.gentleduck/_search-index.json' with { type: 'json' }
import type { ISidebarNavItem } from '~/types/nav'

// Slim search index built by `apps/duck/scripts/build-search-index.mjs`.
// Importing the raw velite collections here would inline ~50 MB of MDX
// bodies into every client component that consumes this module and
// blow up the shared layout chunk. The slim payload is ~270 KB.

export const packageSidebarNavs = searchIndex.packageSidebarNavs as Record<string, ISidebarNavItem[]>

export const docsConfig: IDocsConfig = {
  chartsNav: [],
  mainNav: [],
  sidebarNav: [],
}

export const docsEntries = searchIndex.docsEntries

export { navItems } from './nav-items'
