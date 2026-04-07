'use client'

import { cn } from '@gentleduck/libs/cn'
import { contentTransition, scaleBlur } from '@gentleduck/motion/presets/content'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { Slot } from '@gentleduck/primitives/slot'
import { motion } from 'motion/react'
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
>((props, ref) => (
  <motion.div {...scaleBlur} transition={contentTransition}>
    <AspectRatio ref={ref} {...props} />
  </motion.div>
))
MotionAspectRatio.displayName = 'MotionAspectRatio'

export { AspectRatio, MotionAspectRatio }
