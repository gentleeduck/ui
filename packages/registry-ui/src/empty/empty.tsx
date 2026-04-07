'use client'

import { cn } from '@gentleduck/libs/cn'
import { contentTransition, fadeUp, scaleBlur } from '@gentleduck/motion/presets/content'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { VariantProps } from '@gentleduck/variants'
import { motion } from 'motion/react'
import React from 'react'
import { emptyMediaVariants } from './empty.constants'

const Empty = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12',
        className,
      )}
      dir={direction}
      data-slot="empty"
      {...props}
    />
  )
})
Empty.displayName = 'Empty'

const EmptyHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
      data-slot="empty-header"
      {...props}
    />
  )
})
EmptyHeader.displayName = 'EmptyHeader'

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(emptyMediaVariants({ className, variant }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  )
})
EmptyMedia.displayName = 'EmptyMedia'

const EmptyTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('font-medium text-lg tracking-tight', className)} data-slot="empty-title" {...props} />
  )
})
EmptyTitle.displayName = 'EmptyTitle'

const EmptyDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<'p'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="empty-description"
      {...props}
    />
  )
})
EmptyDescription.displayName = 'EmptyDescription'

const EmptyContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm', className)}
      data-slot="empty-content"
      {...props}
    />
  )
})
EmptyContent.displayName = 'EmptyContent'

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const MotionEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => (
  <motion.div {...fadeUp} transition={contentTransition}>
    <Empty ref={ref} {...props} />
  </motion.div>
))
MotionEmpty.displayName = 'MotionEmpty'

const MotionEmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>
>((props, ref) => (
  <motion.div {...scaleBlur} transition={{ ...contentTransition, delay: 0.05 }}>
    <EmptyMedia ref={ref} {...props} />
  </motion.div>
))
MotionEmptyMedia.displayName = 'MotionEmptyMedia'

const MotionEmptyTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => (
  <motion.div {...fadeUp} transition={{ ...contentTransition, delay: 0.1 }}>
    <EmptyTitle ref={ref} {...props} />
  </motion.div>
))
MotionEmptyTitle.displayName = 'MotionEmptyTitle'

const MotionEmptyDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<'p'>>((props, ref) => (
  <motion.div {...fadeUp} transition={{ ...contentTransition, delay: 0.15 }}>
    <EmptyDescription ref={ref} {...props} />
  </motion.div>
))
MotionEmptyDescription.displayName = 'MotionEmptyDescription'

const MotionEmptyContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => (
  <motion.div {...fadeUp} transition={{ ...contentTransition, delay: 0.2 }}>
    <EmptyContent ref={ref} {...props} />
  </motion.div>
))
MotionEmptyContent.displayName = 'MotionEmptyContent'

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  MotionEmpty,
  MotionEmptyContent,
  MotionEmptyDescription,
  MotionEmptyMedia,
  MotionEmptyTitle,
}
