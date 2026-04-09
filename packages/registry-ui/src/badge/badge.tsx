'use client'

import { cn } from '@gentleduck/libs/cn'
import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { Slot } from '@gentleduck/primitives/slot'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
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

const MotionBadge = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Badge>>((props, ref) => {
  const content = useMotionPreset('scaleIn', { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition} className="inline-flex">
        <Badge ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionBadge.displayName = 'MotionBadge'

export { Badge, MotionBadge }
