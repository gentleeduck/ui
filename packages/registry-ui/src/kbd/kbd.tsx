'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <kbd
        className={cn(
          'pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-muted-foreground text-xs',
          "[&_svg:not([class*='size-'])]:size-3",
          className,
        )}
        data-slot="kbd"
        dir={direction}
        ref={ref}
        {...props}
      />
    )
  },
)
Kbd.displayName = 'Kbd'

const KbdGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        className={cn('inline-flex items-center gap-1', className)}
        data-slot="kbd-group"
        ref={ref as React.Ref<HTMLElement>}
        {...props}
      />
    )
  },
)
KbdGroup.displayName = 'KbdGroup'

const MOTION_KBD_STAGGER = 0.03

const MotionKbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'> & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const motionOptions = React.useMemo(
      () => ({ transition: springBouncy, delay: index * MOTION_KBD_STAGGER }),
      [index],
    )
    const content = useMotionPreset(scaleIn, motionOptions)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}
          className="inline-flex">
          <Kbd ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionKbd.displayName = 'MotionKbd'

export { Kbd, KbdGroup, MotionKbd }
