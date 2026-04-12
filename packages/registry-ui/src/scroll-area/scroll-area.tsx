'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string
  viewportRef?: React.Ref<HTMLDivElement>
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, viewportClassName, viewportRef, style, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        dir={direction}
        style={style}
        ref={ref}
        {...props}
        data-slot="scroll-area">
        <div ref={viewportRef} className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}>
          {children}
        </div>
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'

/* ------------------------------------------------------------------ */
/*  Motion variant                                                      */
/* ------------------------------------------------------------------ */

const MOTION_SCROLL_AREA_OPTIONS = { transition: springBouncy } as const

const MotionScrollArea = React.forwardRef<
  HTMLDivElement,
  Omit<ScrollAreaProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ children, className, viewportClassName, viewportRef, style, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset(scaleIn, MOTION_SCROLL_AREA_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        className={cn('relative overflow-hidden', className)}
        dir={direction}
        style={style}
        ref={ref}
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        {...props}
        data-slot="scroll-area">
        <div ref={viewportRef} className={cn('scrollbar-none h-full w-full overflow-auto', viewportClassName)}>
          {children}
        </div>
      </m.div>
    </LazyMotion>
  )
})
MotionScrollArea.displayName = 'MotionScrollArea'

export { MotionScrollArea, ScrollArea }
