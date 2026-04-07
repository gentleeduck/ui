'use client'

import { cn } from '@gentleduck/libs/cn'
import { contentTransition, fadeUp } from '@gentleduck/motion/presets/content'
import { Slot } from '@gentleduck/primitives/slot'
import type { VariantProps } from '@gentleduck/variants'
import { motion } from 'motion/react'
import * as React from 'react'
import { badgeVariants } from './badge.constants'

const Badge = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLProps<HTMLDivElement>, 'size'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }
>(({ className, variant = 'default', size = 'default', border = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp ref={ref} className={cn(badgeVariants({ border, size, variant }), className)} data-slot="badge" {...props} />
  )
})
Badge.displayName = 'Badge'

const MotionBadge = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Badge>>((props, ref) => (
  <motion.div {...fadeUp} transition={contentTransition} className="inline-flex">
    <Badge ref={ref} {...props} />
  </motion.div>
))
MotionBadge.displayName = 'MotionBadge'

export { Badge, MotionBadge }
