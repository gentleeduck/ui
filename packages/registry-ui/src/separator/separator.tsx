'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
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

const MotionSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, orientation = 'horizontal', dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const isHorizontal = orientation === 'horizontal'
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-border',
          isHorizontal ? 'h-px w-full' : 'min-h-full w-px',
          className,
        )}
        dir={direction}
        initial={{ opacity: 0, scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        transition={springBouncy}
        {...props}
        data-slot="separator"
      />
    </LazyMotion>
  )
})
MotionSeparator.displayName = 'MotionSeparator'

export { MotionSeparator, Separator }
