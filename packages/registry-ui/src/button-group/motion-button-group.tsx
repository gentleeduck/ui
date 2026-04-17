'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { Variants } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { buttonGroupVariants } from './button-group.constants'

const MotionButtonGroup = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentPropsWithoutRef<'div'> & Variants.VariantProps<typeof buttonGroupVariants>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  >
>(({ className, orientation = 'horizontal', dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        ref={ref}
        className={cn(buttonGroupVariants({ orientation }), className)}
        data-orientation={orientation}
        data-slot="button-group"
        dir={direction}
        role="group"
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        {...props}
      />
    </LazyMotion>
  )
})
MotionButtonGroup.displayName = 'MotionButtonGroup'

export { MotionButtonGroup }
