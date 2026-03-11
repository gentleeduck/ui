'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, htmlFor, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: label is composed with form controls externally via htmlFor
    <label
      className={cn(
        'text-balance font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
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
