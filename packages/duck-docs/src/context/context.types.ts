import type { MainNavItem, SidebarNavItem } from '@duck-docs/types/nav'

export interface DocsConfig {
  chartsNav?: SidebarNavItem[]
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface DocsSiteConfig {
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
    community?: string
    discord?: string
    email?: string
    github?: string
    security?: string
    sponsor?: string
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

export interface DocsEntry {
  component?: boolean
  content?: string
  permalink?: string
  slug: string
  title: string
  toc?: TocEntry[]
}

export interface TocEntry {
  items?: TocEntry[]
  title: string
  url: string
}

export interface DocsContextValue {
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  registryIndex?: RegistryIndex
  siteConfig: DocsSiteConfig
}

export type RegistryIndex = Record<string, { component?: React.ComponentType } & Record<string, unknown>>
