'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { toDirection } from '../direction/direction.libs'
import type { IScrollAreaProps } from './scroll-area'

const MOTION_SCROLL_AREA_OPTIONS = { transition: springBouncy } as const

const MotionScrollArea = React.forwardRef<
  HTMLDivElement,
  Omit<IScrollAreaProps, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ children, className, viewportClassName, viewportRef, style, dir, ...props }, ref) => {
  const direction = useDirection(toDirection(dir))
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

export { MotionScrollArea }
