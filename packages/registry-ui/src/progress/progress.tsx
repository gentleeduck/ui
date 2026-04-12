'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const MOTION_PROGRESS_BAR_STYLE = { originX: 0 } as const
const MOTION_PROGRESS_BAR_INITIAL = { scaleX: 0, opacity: 0.5 } as const
const MOTION_PROGRESS_BAR_TRANSITION = {
  scaleX: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  opacity: { duration: 0.2, ease: 'easeOut' },
} as const
const MOTION_PROGRESS_SHIMMER_INITIAL = { x: '-100%' } as const
const MOTION_PROGRESS_SHIMMER_ANIMATE = { x: '200%' } as const
const MOTION_PROGRESS_SHIMMER_TRANSITION = {
  duration: 2,
  ease: 'easeInOut',
  repeat: Number.POSITIVE_INFINITY,
  repeatDelay: 0.5,
} as const

const Progress = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'ref'> & { value: number }
>(({ className, value, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      ref={ref}
      {...props}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      dir={direction}
      data-slot="progress"
      role="progressbar">
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </div>
  )
})
Progress.displayName = 'Progress'

const MotionProgress = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'value' | 'ref'> & { value: number }
>(({ className, value, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const safeValue = Math.max(0, Math.min(100, value ?? 0))
  const barAnimate = React.useMemo(() => ({ scaleX: safeValue / 100, opacity: 1 }), [safeValue])
  return (
    <LazyMotion features={loadDomAnimation}>
      <div
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
        ref={ref}
        {...props}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        dir={direction}
        data-slot="progress"
        role="progressbar">
        <m.div
          className="relative h-full bg-primary"
          style={MOTION_PROGRESS_BAR_STYLE}
          initial={MOTION_PROGRESS_BAR_INITIAL}
          animate={barAnimate}
          transition={MOTION_PROGRESS_BAR_TRANSITION}>
          {/* Subtle shine sweep for a smoother, more alive feel */}
          <m.span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)]"
            initial={MOTION_PROGRESS_SHIMMER_INITIAL}
            animate={MOTION_PROGRESS_SHIMMER_ANIMATE}
            transition={MOTION_PROGRESS_SHIMMER_TRANSITION}
          />
        </m.div>
      </div>
    </LazyMotion>
  )
})
MotionProgress.displayName = 'MotionProgress'

export { MotionProgress, Progress }
