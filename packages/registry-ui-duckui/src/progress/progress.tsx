'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'ref'> & { value: number }
>(({ className, value, ...props }, ref) => {
  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      ref={ref}
      {...props}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      data-slot="progress"
      role="progressbar">
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

export { Progress }
