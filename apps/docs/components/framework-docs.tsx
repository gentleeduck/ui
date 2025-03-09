'use client'

import * as React from 'react'
// ! FIX: fix the import path
// @ts-expect-error Cannot find module 'contentlayer/generated' or its corresponding type declarations.ts(2307) 
import { allDocs } from 'contentlayer/generated'

import { Mdx } from './mdx-components'

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  const frameworkDoc = allDocs.find((doc: { slug: string }) => doc.slug === `/docs/installation/${props.data}`)

  if (!frameworkDoc) {
    return null
  }

  return <Mdx code={frameworkDoc.body.code} />
}
