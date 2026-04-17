'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { tapScale } from '@gentleduck/motion/presets/content'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import * as TogglePrimitive from '@gentleduck/primitives/toggle'
import type { Variants } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { toggleVariants } from './toggle.constants'

const MotionToggle = React.forwardRef<
  HTMLButtonElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & Variants.VariantProps<typeof toggleVariants>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  >
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  const presetOptions = React.useMemo(() => ({ transition: springBouncy }), [])
  const content = useMotionPreset(scaleIn, presetOptions)
  return (
    <LazyMotion features={loadDomAnimation}>
      <TogglePrimitive.Root asChild ref={ref} {...props}>
        <m.button whileTap={tapScale} className={cn(toggleVariants({ className, size, variant }))} data-slot="toggle">
          {React.Children.map(children, (child, i) => (
            <m.span
              key={i}
              initial={content.initial}
              animate={content.animate}
              transition={{ ...content.transition, delay: i * 0.05 }}
              className="inline-flex">
              {child}
            </m.span>
          ))}
        </m.button>
      </TogglePrimitive.Root>
    </LazyMotion>
  )
})
MotionToggle.displayName = 'MotionToggle'

export { MotionToggle }
