import type { MainNavItem, SidebarNavItem } from '@duck-docs/types/nav'

export interface IDocsConfig {
  chartsNav?: SidebarNavItem[]
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface IDocsSiteConfig {
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

export interface IDocsEntry {
  component?: boolean
  content?: string
  permalink?: string
  slug: string
  title: string
  toc?: ITocEntry[]
}

export interface ITocEntry {
  items?: ITocEntry[]
  title: string
  url: string
}

export interface IDocsContextValue {
  docs?: IDocsEntry[]
  docsConfig: IDocsConfig
  registryIndex?: RegistryIndex
  siteConfig: IDocsSiteConfig
}

export type RegistryIndex = Record<string, { component?: React.ComponentType } & Record<string, unknown>>
