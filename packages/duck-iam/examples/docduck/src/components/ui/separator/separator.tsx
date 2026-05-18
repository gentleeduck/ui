'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import * as React from 'react'

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement> & {
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, orientation = 'horizontal', dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <hr
      ref={ref}
      aria-orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'min-h-full w-px', className)}
      dir={direction}
      {...props}
      data-slot="separator"
    />
  )
})
Separator.displayName = 'Separator'

export { Separator }
