'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Kbd } from './kbd'

const MOTION_KBD_STAGGER = 0.03

const MotionKbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'> & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const motionOptions = React.useMemo(
      () => ({ transition: springBouncy, delay: index * MOTION_KBD_STAGGER }),
      [index],
    )
    const content = useMotionPreset(scaleIn, motionOptions)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div
          initial={content.initial}
          animate={content.animate}
          transition={content.transition}
          className="inline-flex">
          <Kbd ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionKbd.displayName = 'MotionKbd'

export { MotionKbd }
