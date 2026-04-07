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
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MotionAlert = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Alert>>((props, ref) => (
  <motion.div {...fadeUp} transition={contentTransition}>
    <Alert ref={ref} {...props} />
  </motion.div>
))
MotionAlert.displayName = 'MotionAlert'

const MotionAlertTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AlertTitle>>(
  (props, ref) => (
    <motion.div {...fadeUp} transition={{ ...contentTransition, delay: 0.1 }}>
      <AlertTitle ref={ref} {...props} />
    </motion.div>
  ),
)
MotionAlertTitle.displayName = 'MotionAlertTitle'

const MotionAlertDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof AlertDescription>
>((props, ref) => (
  <motion.div {...fadeUp} transition={{ ...contentTransition, delay: 0.18 }}>
    <AlertDescription ref={ref} {...props} />
  </motion.div>
))
MotionAlertDescription.displayName = 'MotionAlertDescription'

export { Alert, AlertDescription, AlertTitle, MotionAlert, MotionAlertDescription, MotionAlertTitle }
