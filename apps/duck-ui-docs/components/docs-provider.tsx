'use client'

import type { DocsConfig, DocsEntry, DocsSiteConfig } from '@gentleduck/docs'
import { DocsProvider } from '@gentleduck/docs'
import type React from 'react'
import { Index } from '~/__ui_registry__'

type DocsProviderProps = {
  children: React.ReactNode
  docs?: DocsEntry[]
  docsConfig: DocsConfig
  siteConfig: DocsSiteConfig
}

export function DocsAppProvider({ children, docs, docsConfig, siteConfig }: DocsProviderProps) {
  return (
    <DocsProvider docs={docs} docsConfig={docsConfig} registryIndex={Index} siteConfig={siteConfig}>
      {children}
    </DocsProvider>
  )
}
