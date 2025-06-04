'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

function ScrollArea({
  className,
  children,
  label,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  label?: string
}) {
  return (
    <div
      className={cn(
        'overflow-auto [scrollbar-width:thin] [scrollbar-gutter:stable] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--border)_transparent]',
        className,
      )}
      role={label ? 'region' : undefined}
      aria-label={label}
      tabIndex={0}
      {...props}
      duck-scroll-area="">
      {children}
    </div>
  )
}

export { ScrollArea }
