'use client'

import { MotionToggle } from '@gentleduck/registry-ui/toggle'
import { Bold, Italic, Underline, AlignLeft, Star } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <MotionToggle aria-label="Toggle bold" variant="outline">
        <Bold />
      </MotionToggle>
      <MotionToggle aria-label="Toggle italic" variant="outline">
        <Italic />
        Italic
      </MotionToggle>
      <MotionToggle aria-label="Toggle underline" variant="outline">
        <Underline />
        Underline
      </MotionToggle>
      <MotionToggle aria-label="Toggle align" variant="outline" size="lg">
        <AlignLeft />
        Align Left
      </MotionToggle>
      <MotionToggle aria-label="Toggle favorite" variant="outline" size="sm">
        <Star />
      </MotionToggle>
    </div>
  )
}
