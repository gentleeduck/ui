'use client'

import * as React from 'react'
import { cn } from '@gentleduck/libs/cn'

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {}

function Label({ className, ref, ...props }: LabelProps) {
  return (
    <label
      ref={ref}
      className={cn(
        'font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
