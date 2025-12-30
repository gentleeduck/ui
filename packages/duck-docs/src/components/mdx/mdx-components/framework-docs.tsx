'use client'

import type * as React from 'react'

import { useDocsEntries } from '@duck-docs/context'
import { Mdx } from '@duck-docs/components/mdx/mdx'

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  const docs = useDocsEntries() ?? []
  const frameworkDoc = docs.find((doc) => doc.slug === `/docs/installation/${props.data}`)

  if (!frameworkDoc?.content) {
    return null
  }

  return <Mdx code={frameworkDoc.content} />
}
