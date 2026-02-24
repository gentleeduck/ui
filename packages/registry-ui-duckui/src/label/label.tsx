'use client'

import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'
import { useDirection } from '@gentleduck/primitives/hooks/direction'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, htmlFor, ...props }, ref) => {
  const direction = useDirection((props as { dir?: 'ltr' | 'rtl' }).dir)
  return (
    <label
      aria-label="label"
      className={cn(
        'text-balance font-medium font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      data-slot="label"
      dir={direction}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    />
  )
})
Label.displayName = 'Label'

export { Label }
