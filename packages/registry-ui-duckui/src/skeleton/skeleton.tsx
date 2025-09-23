import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
      data-slot="skeleton"
    />
  )
}

export { Skeleton }
