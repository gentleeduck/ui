'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'ref'> & { value: number }
>(({ className, value, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      ref={ref}
      {...props}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      dir={direction}
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
