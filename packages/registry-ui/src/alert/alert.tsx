'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { alertVariants } from './alert.constants'

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <div
      ref={ref}
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      dir={direction}
      role="alert"
      {...props}
    />
  )
})
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      data-slot="alert-title"
      {...props}
    />
  ),
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  ),
)
AlertDescription.displayName = 'AlertDescription'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MOTION_ALERT_OPTIONS = { transition: springBouncy } as const
const MOTION_ALERT_TITLE_OPTIONS = { transition: springBouncy, delay: 0.1 } as const
const MOTION_ALERT_DESCRIPTION_OPTIONS = { transition: springBouncy, delay: 0.18 } as const

const MotionAlert = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  >
>(({ className, variant, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  const content = useMotionPreset(scaleIn, MOTION_ALERT_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        data-slot="alert"
        dir={direction}
        role="alert"
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        {...props}
      />
    </LazyMotion>
  )
})
MotionAlert.displayName = 'MotionAlert'

const MotionAlertTitle = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, MOTION_ALERT_TITLE_OPTIONS)
  return (
    <m.div
      ref={ref}
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      data-slot="alert-title"
      initial={content.initial}
      animate={content.animate}
      transition={content.transition}
      {...props}
    />
  )
})
MotionAlertTitle.displayName = 'MotionAlertTitle'

const MotionAlertDescription = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>
>(({ className, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, MOTION_ALERT_DESCRIPTION_OPTIONS)
  return (
    <m.div
      ref={ref}
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className,
      )}
      data-slot="alert-description"
      initial={content.initial}
      animate={content.animate}
      transition={content.transition}
      {...props}
    />
  )
})
MotionAlertDescription.displayName = 'MotionAlertDescription'

export { Alert, AlertDescription, AlertTitle, MotionAlert, MotionAlertDescription, MotionAlertTitle }
