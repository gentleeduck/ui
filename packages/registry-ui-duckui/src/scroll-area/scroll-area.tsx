'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

export interface ScrollAreaProps extends React.HTMLProps<HTMLDivElement> {}

const ScrollArea = ({ className, children, ...props }: ScrollAreaProps) => (
  <div
    className={cn(
      'overflow-auto [scrollbar-width:thin] [scrollbar-gutter:stable] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--border)_transparent]',
      className,
    )}
    {...props}>
    {children}
  </div>
)

export { ScrollArea }
