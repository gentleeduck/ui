'use client'

import * as React from 'react'

import { docs } from '~/.velite'
import { Mdx } from '../mdx'

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  const frameworkDoc = docs.find((doc: { slug: string }) => doc.slug === `/docs/installation/${props.data}`)

  if (!frameworkDoc) {
    return null
  }

  return <Mdx code={frameworkDoc.content} />
}
