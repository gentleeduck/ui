'use client'

import * as React from 'react'
import type { IDocsConfig, IDocsContextValue, IDocsEntry, IDocsSiteConfig, RegistryIndex } from './context.types'

const DocsContext = React.createContext<IDocsContextValue | null>(null)

export function DocsProvider({
  children,
  docs,
  docsConfig,
  registryIndex,
  siteConfig,
}: {
  children: React.ReactNode
  docs?: IDocsEntry[]
  docsConfig: IDocsConfig
  registryIndex?: RegistryIndex
  siteConfig: IDocsSiteConfig
}) {
  const value = React.useMemo(
    () => ({
      docs,
      docsConfig,
      registryIndex,
      siteConfig,
    }),
    [docs, docsConfig, registryIndex, siteConfig],
  )

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>
}

export function useDocsContext() {
  const context = React.useContext(DocsContext)
  if (!context) {
    throw new Error(
      'DocsProvider is missing. Wrap your app with <DocsProvider> from @gentleduck/docs and pass docsConfig and siteConfig.',
    )
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

export function useRegistryIndex() {
  return useDocsContext().registryIndex
}
