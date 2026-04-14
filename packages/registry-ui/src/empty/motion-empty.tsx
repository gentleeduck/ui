'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type { VariantProps } from '@gentleduck/variants'
import { LazyMotion, m } from 'motion/react'
import React from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from './empty'
import type { emptyMediaVariants } from './empty.constants'

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

export { MotionEmpty, MotionEmptyContent, MotionEmptyDescription, MotionEmptyMedia, MotionEmptyTitle }
