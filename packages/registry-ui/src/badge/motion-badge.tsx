'use client'

import { popIn } from '@gentleduck/motion/presets/pop-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import { withMotion } from '../_internal/motion-shell'
import { Badge } from './badge'

const MotionBadge = withMotion(Badge, popIn, { transition: springBouncy })
MotionBadge.displayName = 'MotionBadge'

export { MotionBadge }
