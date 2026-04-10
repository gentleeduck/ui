'use client'

import { MotionBadge } from '@gentleduck/registry-ui/badge'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MotionBadge>Default</MotionBadge>
      <MotionBadge variant="secondary">Secondary</MotionBadge>
      <MotionBadge variant="destructive">Destructive</MotionBadge>
      <MotionBadge variant="outline">Outline</MotionBadge>
    </div>
  )
}
