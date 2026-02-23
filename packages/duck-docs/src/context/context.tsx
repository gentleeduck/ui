'use client'

import * as React from 'react'
import type { DocsConfig, DocsContextValue, DocsEntry, DocsSiteConfig, RegistryIndex } from './context.types'

const DocsContext = React.createContext<DocsContextValue | null>(null)

export function DocsProvider({
  children,
  docs,
  docsConfig,
  registryIndex,
  siteConfig,
}: {
  children: React.ReactNode
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  registryIndex?: RegistryIndex
  siteConfig: DocsSiteConfig
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
  const { docsConfig } = useDocsContext()
  if (!docsConfig) {
    throw new Error('DocsProvider is missing docsConfig. Pass docsConfig to <DocsProvider>.')
  }
  return docsConfig
}

export function useSiteConfig() {
  const { siteConfig } = useDocsContext()
  if (!siteConfig) {
    throw new Error('DocsProvider is missing siteConfig. Pass siteConfig to <DocsProvider>.')
  }
  return siteConfig
}

export function useDocsEntries() {
  return useDocsContext().docs
}

export function useRegistryIndex() {
  return useDocsContext().registryIndex
}
