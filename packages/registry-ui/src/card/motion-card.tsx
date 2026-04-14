'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './card'

const MotionCard = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
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
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.05 })
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
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.1 })
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
  const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: 0.15 })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <CardFooter ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionCardFooter.displayName = 'MotionCardFooter'

export { MotionCard, MotionCardContent, MotionCardFooter, MotionCardHeader }
