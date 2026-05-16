import type { IDocsConfig, ISidebarNavItem } from '@gentleduck/docs'

export interface ITypedSidebarItem<THref extends string> {
  title: string
  href?: THref
  collapsible?: boolean
  defaultOpen?: boolean
  items?: ITypedSidebarItem<THref>[]
}

/** First section renders without a title (matches legacy auto-generated layout). */
export interface ITypedSidebarSection<THref extends string> {
  title: string
  href?: THref
  collapsible?: boolean
  defaultOpen?: boolean
  items: ITypedSidebarItem<THref>[]
}

function mapItem<THref extends string>(item: ITypedSidebarItem<THref>): ISidebarNavItem {
  return {
    title: item.title,
    ...(item.href ? { href: item.href } : {}),
    ...(item.collapsible ? { collapsible: true } : {}),
    ...(item.defaultOpen ? { defaultOpen: true } : {}),
    items: item.items ? item.items.map(mapItem) : [],
  }
}

export function defineSidebar<THref extends string>(sections: ITypedSidebarSection<THref>[]): IDocsConfig {
  return {
    mainNav: [],
    chartsNav: [],
    sidebarNav: sections.map<ISidebarNavItem>((section) => ({
      title: section.title,
      ...(section.href ? { href: section.href } : {}),
      ...(section.collapsible ? { collapsible: true } : {}),
      ...(section.defaultOpen ? { defaultOpen: true } : {}),
      items: section.items.map(mapItem),
    })),
  }
}
