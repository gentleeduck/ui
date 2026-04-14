'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Input } from './input'

const MotionInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'> & { index?: number }>(
  ({ index = 0, ...props }, ref) => {
    const options = React.useMemo(() => ({ transition: springBouncy, delay: index * 0.05 }), [index])
    const content = useMotionPreset(scaleIn, options)
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
          <Input ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionInput.displayName = 'MotionInput'

export { MotionInput }
