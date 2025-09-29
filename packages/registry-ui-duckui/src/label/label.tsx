'use client'

import { cn } from '@gentleduck/libs/cn'
import type * as React from 'react'

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {}

function Label({ className, htmlFor, ref, ...props }: LabelProps) {
  return (
    <label
      aria-label="label"
      className={cn(
        'text-balance font-medium font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      data-slot="label"
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    />
  )
}

export { Label }
