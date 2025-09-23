'use client'

import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'

function Progress({
  className,
  ref,
  value,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'value'> & { value: number }) {
  return (
    <div
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
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
}

export { Progress }
