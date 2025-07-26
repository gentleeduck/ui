'use client'

import * as React from 'react'

import { cn } from '@gentleduck/libs/cn'
import { CodeBlockWrapper } from './code-block-wrapper'

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  src: string
}

export function ComponentSource({ children, className, ...props }: ComponentSourceProps) {
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn('my-6 overflow-hidden rounded-md [&_[data-rehype-pretty-code-fragment]]:mb-4', className)}
      {...props}>
      {children}
    </CodeBlockWrapper>
  )
}
