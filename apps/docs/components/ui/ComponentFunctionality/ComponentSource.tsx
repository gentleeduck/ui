'use client'

import * as React from 'react'

import { cn } from '@duck/libs/cn'
import { CodeBlockWrapper } from '~/components/code-block-wrapper'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

export function ComponentSource({
  children,
  className,
  ...props
}: ComponentSourceProps) {
  console.log(children, props)
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn('my-6 overflow-hidden rounded-md', className)}
    >
      {children}
    </CodeBlockWrapper>
  )
}
