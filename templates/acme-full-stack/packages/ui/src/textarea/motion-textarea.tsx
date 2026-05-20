'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { Textarea } from './textarea'

const MotionTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => {
    const content = useMotionPreset(scaleIn, { transition: springBouncy })
    return (
      <LazyMotion features={loadDomAnimation}>
        <m.div initial={content.initial} animate={content.animate} transition={content.transition} className="w-full">
          <Textarea ref={ref} {...props} />
        </m.div>
      </LazyMotion>
    )
  },
)
MotionTextarea.displayName = 'MotionTextarea'

export { MotionTextarea }
