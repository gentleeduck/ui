'use client'

import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { withMotion } from '../_internal/motion-shell'
import { AspectRatio } from './aspect-ratio'

const MotionAspectRatio = withMotion(AspectRatio, scaleIn, { transition: springBouncy }, undefined)
MotionAspectRatio.displayName = 'MotionAspectRatio'

export { MotionAspectRatio }
