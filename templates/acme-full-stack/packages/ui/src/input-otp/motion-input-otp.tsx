'use client'

import { loadDomAnimation } from '@gentleduck/motion/motion-features'
import { useMotionPreset } from '@gentleduck/motion/motion-presets'
import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type * as InputOTPPrimitive from '@gentleduck/primitives/input-otp'
import { LazyMotion, m } from 'motion/react'
import * as React from 'react'
import { InputOTP } from './input-otp'

const MotionInputOTP = React.forwardRef<
  React.ComponentRef<typeof InputOTPPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof InputOTPPrimitive.Root>
>((props, ref) => {
  const content = useMotionPreset(scaleIn, { transition: springBouncy })
  return (
    <LazyMotion features={loadDomAnimation}>
      <m.div initial={content.initial} animate={content.animate} transition={content.transition}>
        <InputOTP ref={ref} {...props} />
      </m.div>
    </LazyMotion>
  )
})
MotionInputOTP.displayName = 'MotionInputOTP'

export { MotionInputOTP }
