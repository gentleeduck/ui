'use client'

import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { withMotion } from '../_internal/motion-shell'
import { InputOTP } from './input-otp'

const MotionInputOTP = withMotion(InputOTP, scaleIn, { transition: springBouncy }, undefined)
MotionInputOTP.displayName = 'MotionInputOTP'

export { MotionInputOTP }
