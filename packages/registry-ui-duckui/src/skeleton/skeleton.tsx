import type * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

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
