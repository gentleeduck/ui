'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

export function CodeBlockWrapper({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}
