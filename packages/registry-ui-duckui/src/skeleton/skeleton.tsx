import { cn } from '@gentleduck/duck-libs/cn'
import type * as React from 'react'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      aria-hidden="true"
      {...props}
      duck-skeleton=""
    />
  )
}

export { Skeleton }
