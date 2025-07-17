'use client'

import type * as React from 'react'

import { cn } from '@gentleduck/libs/cn'

function Progress({
  className,
  ref,
  value,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'value'> & { value: number }) {
  return (
    <div
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}>
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
}

export { Progress }
