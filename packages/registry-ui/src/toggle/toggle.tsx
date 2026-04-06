'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { contentTransition, fadeUp } from '@gentleduck/motion/presets/content'
import * as TogglePrimitive from '@gentleduck/primitives/toggle'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { toggleVariants } from './toggle.constants'

const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ className, size, variant }))}
      data-slot="toggle"
      ref={ref}
      {...props}
    />
  )
})
Toggle.displayName = 'Toggle'

const MotionToggle = React.forwardRef<
  HTMLButtonElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  >
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  return (
    <LazyMotion features={loadDomAnimation}>
      <TogglePrimitive.Root asChild ref={ref} {...props}>
        <m.button
          whileTap={{ scale: 0.97 }}
          transition={{ scale: { duration: 0, type: 'tween' } }}
          className={cn(toggleVariants({ className, size, variant }))}
          data-slot="toggle">
          {React.Children.map(children, (child, i) => (
            <m.span key={i} {...fadeUp} transition={{ ...contentTransition, delay: i * 0.05 }} className="inline-flex">
              {child}
            </m.span>
          ))}
        </m.button>
      </TogglePrimitive.Root>
    </LazyMotion>
  )
})
MotionToggle.displayName = 'MotionToggle'

export { MotionToggle, Toggle }
