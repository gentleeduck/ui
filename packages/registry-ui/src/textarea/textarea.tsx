'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <textarea
        className={cn(
          'field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80',
          className,
        )}
        data-slot="textarea"
        dir={direction}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

const MotionTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => {
    const content = useMotionPreset(scaleIn, { transition: springBouncy })
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}
          className="w-full">
          <Textarea ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionTextarea.displayName = 'MotionTextarea'

export { MotionTextarea, Textarea }
