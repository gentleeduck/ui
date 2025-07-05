'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

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
        'overflow-auto [scrollbar-color:transparent_transparent] [scrollbar-width:thin] hover:[scrollbar-color:var(--border)_transparent]',
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
