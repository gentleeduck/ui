'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import React from 'react'
import { AspectRatio } from './aspect-ratio'

const MotionAspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatio>,
  React.ComponentPropsWithoutRef<typeof AspectRatio>
>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <AspectRatio ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionAspectRatio.displayName = 'MotionAspectRatio'

export { MotionAspectRatio }
