'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, dir, ...props }, ref) => {
    const direction = useDirection(dir as Direction)
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm', className)}
        data-card=""
        dir={direction}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-card-action:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('font-semibold leading-none', className)} data-slot="card-title" {...props} />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-muted-foreground text-sm', className)} data-slot="card-description" {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      data-slot="card-action"
      {...props}
    />
  ),
)
CardAction.displayName = 'CardAction'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6', className)} data-slot="card-content" {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 px-6 [.border-t]:pt-6', className)}
      data-slot="card-footer"
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

/* ------------------------------------------------------------------ */
/*  MotionCard                                                         */
/* ------------------------------------------------------------------ */

const CARD_OPTIONS = { transition: springBouncy } as const
const CARD_HEADER_OPTIONS = { transition: springBouncy, delay: 0.05 } as const
const CARD_CONTENT_OPTIONS = { transition: springBouncy, delay: 0.1 } as const
const CARD_FOOTER_OPTIONS = { transition: springBouncy, delay: 0.15 } as const

const MotionCard = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>((props, ref) => {
  const content = useMotionPreset('scaleIn', CARD_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <Card ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionCard.displayName = 'MotionCard'

const MotionCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const content = useMotionPreset('scaleIn', CARD_HEADER_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <CardHeader ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionCardHeader.displayName = 'MotionCardHeader'

const MotionCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const content = useMotionPreset('scaleIn', CARD_CONTENT_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <CardContent ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionCardContent.displayName = 'MotionCardContent'

const MotionCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const content = useMotionPreset('scaleIn', CARD_FOOTER_OPTIONS)
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <CardFooter ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionCardFooter.displayName = 'MotionCardFooter'

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  MotionCard,
  MotionCardContent,
  MotionCardFooter,
  MotionCardHeader,
}
