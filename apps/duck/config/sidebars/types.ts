import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

/**
 * Strict sidebar item — `href` is required, items can nest one level.
 *
 * Used by per-package sidebar configs where every link points at a real
 * doc route (no abstract section parents without an href).
 */
export interface ITypedSidebarItem<THref extends string> {
  title: string
  href: THref
}

/**
 * Section grouping with a title and a list of leaf links.
 *
 * The first section in a config is rendered without a title (matches the
 * old auto-generated layout where the top group was untitled).
 */
export interface ITypedSidebarSection<THref extends string> {
  title: string
  href?: THref
  items: ITypedSidebarItem<THref>[]
}

/** Build the runtime IDocsConfig from a typed config (preserves type info at the call site, returns the legacy shape). */
export function defineSidebar<THref extends string>(sections: ITypedSidebarSection<THref>[]): IDocsConfig {
  return {
    mainNav: [],
    chartsNav: [],
    sidebarNav: sections.map<ISidebarNavItem>((section) => ({
      title: section.title,
      ...(section.href ? { href: section.href } : {}),
      items: section.items.map((item) => ({
        title: item.title,
        href: item.href,
        items: [],
      })),
    })),
  }
}
