'use client'

import type { IDocsConfig, IDocsEntry, IDocsSiteConfig } from '@gentleduck/docs'
import { DocsProvider } from '@gentleduck/docs/client'
import type React from 'react'
import { Index } from '~/__ui_registry__'

type DocsProviderProps = {
  children: React.ReactNode
  docs?: IDocsEntry[]
  docsConfig: IDocsConfig
  siteConfig: IDocsSiteConfig
}

export function DocsAppProvider({ children, docs, docsConfig, siteConfig }: DocsProviderProps) {
  return (
    <DocsProvider {...(docs && { docs })} docsConfig={docsConfig} registryIndex={Index} siteConfig={siteConfig}>
      {children}
    </DocsProvider>
  )
}
