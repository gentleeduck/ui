'use client'

import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'
import { toDirection } from '../direction/direction.libs'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(toDirection(dir))
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
