import type { MainNavItem, SidebarNavItem } from '@duck-docs/types/nav'
export type DocsConfig = {
  chartsNav?: SidebarNavItem[]
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type DocsSiteConfig = {
  author?: {
    name: string
    url?: string
  }
  branding?: {
    logoDark?: string
    logoLight?: string
  }
  description?: string
  githubRepo?: string
  links?: {
    email?: string
    github?: string
    twitter?: string
  }
  metaThemeColors?: {
    dark: string
    light: string
  }
  name: string
  title?: string
  url?: string
}

export type DocsEntry = {
  component?: boolean
  content?: string
  permalink?: string
  slug: string
  title: string
  toc?: TocEntry[]
}

export type TocEntry = {
  items?: TocEntry[]
  title: string
  url: string
}

export type DocsContextValue = {
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  registryIndex?: RegistryIndex
  siteConfig: DocsSiteConfig
}

export type RegistryIndex = Record<string, { component?: React.ComponentType } & Record<string, unknown>>
