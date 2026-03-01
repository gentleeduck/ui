import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
        dir={direction}
        {...props}
        data-slot="skeleton"
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
