'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type { Variants } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Item, ItemGroup } from './item'
import type { itemVariants } from './item.constants'

const MotionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> &
    Variants.VariantProps<typeof itemVariants> & { asChild?: boolean; index?: number }
>(({ index = 0, ...props }, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: index * 0.04 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <Item ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionItem.displayName = 'MotionItem'

const MotionItemGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <ItemGroup ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionItemGroup.displayName = 'MotionItemGroup'

export { MotionItem, MotionItemGroup }
