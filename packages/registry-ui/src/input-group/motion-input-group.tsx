'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { InputGroup } from './input-group'

const MotionInputGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'> & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const content = useMotionPreset(scaleIn, { transition: springBouncy, delay: index * 0.05 })
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
          <InputGroup ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionInputGroup.displayName = 'MotionInputGroup'

export { MotionInputGroup }
