import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export interface ITypedSidebarItem<THref extends string> {
  title: string
  href: THref
}

/** First section renders without a title (matches legacy auto-generated layout). */
export interface ITypedSidebarSection<THref extends string> {
  title: string
  href?: THref
  items: ITypedSidebarItem<THref>[]
}

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
