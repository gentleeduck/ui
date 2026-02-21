import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
      data-slot="skeleton"
    />
  ),
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
