'use client'

import * as React from 'react'
import type { MainNavItem, SidebarNavItem } from '../types/nav'

export type DocsConfig = {
  chartsNav: SidebarNavItem[]
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

type DocsContextValue = {
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  siteConfig: DocsSiteConfig
}

const DocsContext = React.createContext<DocsContextValue | null>(null)

export function DocsProvider({
  children,
  docs,
  docsConfig,
  siteConfig,
}: {
  children: React.ReactNode
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  siteConfig: DocsSiteConfig
}) {
  const value = React.useMemo(
    () => ({
      docs,
      docsConfig,
      siteConfig,
    }),
    [docs, docsConfig, siteConfig],
  )

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>
}

export function useDocsContext() {
  const context = React.useContext(DocsContext)
  if (!context) {
    throw new Error('DocsProvider is missing.')
  }
  return context
}

export function useDocsConfig() {
  return useDocsContext().docsConfig
}

export function useSiteConfig() {
  return useDocsContext().siteConfig
}

export function useDocsEntries() {
  return useDocsContext().docs
}
