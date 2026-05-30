'use client'

import { scaleIn } from '@gentleduck/motion/presets/scale-in'
import { springBouncy } from '@gentleduck/motion/transitions/springs'
import type * as React from 'react'
import { withMotion } from '../_internal/motion-shell'
import { Skeleton } from './skeleton'

const MotionSkeleton = withMotion<React.HTMLAttributes<HTMLDivElement> & { index?: number }, HTMLDivElement>(
  Skeleton,
  scaleIn,
  { transition: springBouncy },
  { optionsFromProps: ({ index = 0 }) => ({ delay: index * 0.05 }) },
)

export { MotionSkeleton }
