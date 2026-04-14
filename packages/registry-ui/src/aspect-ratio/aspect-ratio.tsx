'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Slot } from '@gentleduck/primitives/slot'
import React from 'react'

const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    ratio: string
  }
>(({ style, className, ratio, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <Slot
      className={cn('relative h-auto w-full overflow-hidden', className)}
      dir={direction}
      ref={ref}
      style={{
        aspectRatio: ratio,
        ...style,
      }}
      {...props}
      data-slot="aspect-ratio"
    />
  )
})
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
