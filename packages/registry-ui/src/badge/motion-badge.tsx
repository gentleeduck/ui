import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { popIn } from '@gentleduck/motion/presets/pop-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Badge } from './badge'

const MotionBadge = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Badge>>((props, ref) => {
  const content = useMotionPreset(popIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div
        initial={content.initial}
        animate={content.animate}
        transition={content.transition}
        className="inline-flex">
        <Badge ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionBadge.displayName = 'MotionBadge'

export { MotionBadge }
