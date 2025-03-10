'use client'

import * as React from 'react'

import { Mdx } from './mdx-components'
import { docs } from '~/.velite'

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  const frameworkDoc = docs.find(
    (doc: { slug: string }) => doc.slug === `/docs/installation/${props.data}`,
  )

  if (!frameworkDoc) {
    return null
  }

  return <Mdx code={frameworkDoc.content} />
}
