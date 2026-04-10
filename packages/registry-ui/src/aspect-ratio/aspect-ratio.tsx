'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Slot } from '@gentleduck/primitives/slot'
import { LazyMotion, m } from 'motion/react'
import React from 'react'

const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    ratio: string
  }
>(({ style, className, ratio, dir, ...props }, ref) => {
  const direction = useDirection(dir as Direction)
  return (
    <Slot
      className={cn('relative h-auto w-full overflow-hidden', className)}
      dir={direction}
      ref={ref}
      style={{
        aspectRatio: ratio,
        ...style,
      }}
      {...props}
      data-slot="aspect-ratio"
    />
  )
})
AspectRatio.displayName = 'AspectRatio'

const MotionAspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatio>,
  React.ComponentPropsWithoutRef<typeof AspectRatio>
>((props, ref) => {
  const content = useMotionPreset('scaleIn', { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <AspectRatio ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionAspectRatio.displayName = 'MotionAspectRatio'

export { AspectRatio, MotionAspectRatio }
