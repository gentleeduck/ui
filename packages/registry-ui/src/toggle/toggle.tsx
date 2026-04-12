'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { tapScale } from '@gentleduck/motion/presets/content'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
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
  const presetOptions = React.useMemo(() => ({ transition: springBouncy }), [])
  const content = useMotionPreset('scaleIn', presetOptions)
  return (
    <LazyMotion features={loadDomAnimation}>
      <TogglePrimitive.Root asChild ref={ref} {...props}>
        <m.button
          whileTap={tapScale}
          transition={{ scale: { duration: 0, type: 'tween' } }}
          className={cn(toggleVariants({ className, size, variant }))}
          data-slot="toggle">
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

export { MotionToggle, Toggle }
