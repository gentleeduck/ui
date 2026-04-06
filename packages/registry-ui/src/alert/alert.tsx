'use client'

import { cn } from '@gentleduck/libs/cn'
import { contentTransition, fadeUp } from '@gentleduck/motion/presets/content'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { VariantProps } from '@gentleduck/variants'
import { motion } from 'motion/react'
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
/*  Motion variants via motion.create()                                */
/* ------------------------------------------------------------------ */

type MotionSafe<T> = Omit<T, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>

const MotionAlertBase = motion.create(Alert)
const MotionAlert = React.forwardRef<HTMLDivElement, MotionSafe<React.ComponentPropsWithoutRef<typeof Alert>>>(
  ({ ...props }, ref) => <MotionAlertBase ref={ref} {...fadeUp} transition={contentTransition} {...(props as any)} />,
)
MotionAlert.displayName = 'MotionAlert'

const MotionAlertTitleBase = motion.create(AlertTitle)
const MotionAlertTitle = React.forwardRef<
  HTMLDivElement,
  MotionSafe<React.ComponentPropsWithoutRef<typeof AlertTitle>>
>((props, ref) => (
  <MotionAlertTitleBase ref={ref} {...fadeUp} transition={{ ...contentTransition, delay: 0.1 }} {...(props as any)} />
))
MotionAlertTitle.displayName = 'MotionAlertTitle'

const MotionAlertDescriptionBase = motion.create(AlertDescription)
const MotionAlertDescription = React.forwardRef<
  HTMLDivElement,
  MotionSafe<React.ComponentPropsWithoutRef<typeof AlertDescription>>
>((props, ref) => (
  <MotionAlertDescriptionBase
    ref={ref}
    {...fadeUp}
    transition={{ ...contentTransition, delay: 0.18 }}
    {...(props as any)}
  />
))
MotionAlertDescription.displayName = 'MotionAlertDescription'

export { Alert, AlertDescription, AlertTitle, MotionAlert, MotionAlertDescription, MotionAlertTitle }
