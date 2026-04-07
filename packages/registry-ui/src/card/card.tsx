'use client'

import { cn } from '@gentleduck/libs/cn'
import { contentTransition, fadeUp } from '@gentleduck/motion/presets/content'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { motion } from 'motion/react'
import * as React from 'react'

type MotionSafe<T> = Omit<T, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>

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

const MotionCardBase = motion.create(Card)
const MotionCard = React.forwardRef<HTMLDivElement, MotionSafe<React.ComponentPropsWithoutRef<typeof Card>>>(
  (props, ref) => <MotionCardBase ref={ref} {...fadeUp} transition={contentTransition} {...(props as any)} />,
)
MotionCard.displayName = 'MotionCard'

const MotionCardHeaderBase = motion.create(CardHeader)
const MotionCardHeader = React.forwardRef<HTMLDivElement, MotionSafe<React.HTMLAttributes<HTMLDivElement>>>(
  (props, ref) => (
    <MotionCardHeaderBase ref={ref} {...fadeUp} transition={{ ...contentTransition, delay: 0.05 }} {...(props as any)} />
  ),
)
MotionCardHeader.displayName = 'MotionCardHeader'

const MotionCardContentBase = motion.create(CardContent)
const MotionCardContent = React.forwardRef<HTMLDivElement, MotionSafe<React.HTMLAttributes<HTMLDivElement>>>(
  (props, ref) => (
    <MotionCardContentBase
      ref={ref}
      {...fadeUp}
      transition={{ ...contentTransition, delay: 0.1 }}
      {...(props as any)}
    />
  ),
)
MotionCardContent.displayName = 'MotionCardContent'

const MotionCardFooterBase = motion.create(CardFooter)
const MotionCardFooter = React.forwardRef<HTMLDivElement, MotionSafe<React.HTMLAttributes<HTMLDivElement>>>(
  (props, ref) => (
    <MotionCardFooterBase
      ref={ref}
      {...fadeUp}
      transition={{ ...contentTransition, delay: 0.15 }}
      {...(props as any)}
    />
  ),
)
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
