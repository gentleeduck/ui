import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/hooks/direction'
import * as React from 'react'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const direction = useDirection((props as { dir?: 'ltr' | 'rtl' }).dir)
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-muted', className)}
        dir={direction}
        {...props}
        data-slot="skeleton"
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }
