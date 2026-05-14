import type { IDocsConfig } from '@gentleduck/docs/context'
import searchIndex from '~/.gentleduck/_search-index.json' with { type: 'json' }
import type { ISidebarNavItem } from '~/types/nav'

// Slim search index (~270 KB). Importing raw velite collections would inline
// ~50 MB of MDX bodies into every client component using this module.
export const packageSidebarNavs = searchIndex.packageSidebarNavs as Record<string, ISidebarNavItem[]>

export const docsConfig: IDocsConfig = {
  chartsNav: [],
  mainNav: [],
  sidebarNav: [],
}

export const docsEntries = searchIndex.docsEntries

export { navItems } from './nav-items'
