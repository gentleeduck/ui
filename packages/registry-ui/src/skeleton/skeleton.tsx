'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
        dir={direction}
        {...props}
        data-slot="skeleton"
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'

const MotionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index?: number }
>(({ className, dir, index = 0, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset('scaleIn', { transition: springBouncy, delay: index * 0.05 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        ref={ref}
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
        dir={direction}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        {...props}
        data-slot="skeleton"
      />
    </LazyMotion>
  )
})
MotionSkeleton.displayName = 'MotionSkeleton'

export { MotionSkeleton, Skeleton }
