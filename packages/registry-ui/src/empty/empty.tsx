'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
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

const MotionEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <Empty ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionEmpty.displayName = 'MotionEmpty'

const MotionEmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>
>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.05 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <EmptyMedia ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionEmptyMedia.displayName = 'MotionEmptyMedia'

const MotionEmptyTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.1 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <EmptyTitle ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionEmptyTitle.displayName = 'MotionEmptyTitle'

const MotionEmptyDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<'p'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.15 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <EmptyDescription ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionEmptyDescription.displayName = 'MotionEmptyDescription'

const MotionEmptyContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.2 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <EmptyContent ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
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
