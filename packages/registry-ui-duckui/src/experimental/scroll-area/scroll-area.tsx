'use client'

import * as React from 'react'
import { cn } from '@gentelduck/libs/cn'

export interface ScrollAreaProps extends React.HTMLProps<HTMLDivElement> {}

const ScrollArea = (({ className, children, ...props }: ScrollAreaProps) => (
  <div
    className={cn('overflow-auto [scrollbar-width:thin] [scrollbar-gutter:stable] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--border)_transparent]', className)}
    {...props}
  >
    {children}
  </div>
))

export { ScrollArea };