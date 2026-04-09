'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <input
        dir={direction}
        type={type}
        className={cn(
          // base
          'h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base outline-none transition-colors',
          // file
          'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm',
          // placeholder
          'placeholder:text-muted-foreground',
          // focus
          'focus-visible:ring-1 focus-visible:ring-ring',
          // disabled
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
          // responsive
          'md:text-sm',
          // dark
          'dark:bg-input/30 dark:disabled:bg-input/80',
          // aria-invalid
          'aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
          // aria-disabled
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
          // aria-warning
          'aria-warning:border-warning aria-warning:text-warning aria-warning:ring-warning/20 dark:aria-warning:border-warning/50 dark:aria-warning:ring-warning/40',
          className,
        )}
        ref={ref}
        data-slot="input"
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

const MotionInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const content = useMotionPreset('scaleIn', { transition: springBouncy, delay: index * 0.05 })
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
          <Input ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionInput.displayName = 'MotionInput'

export { Input, MotionInput }
