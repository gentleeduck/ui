'use client'

import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { withMotion } from '../_internal/motion-shell'
import { Textarea } from './textarea'

const MotionTextarea = withMotion(Textarea, scaleIn, { transition: springBouncy }, 'w-full')
MotionTextarea.displayName = 'MotionTextarea'

export { MotionTextarea }
