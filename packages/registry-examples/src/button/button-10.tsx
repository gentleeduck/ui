'use client'

import { MotionButton } from '@gentleduck/registry-ui/button'
import { ArrowRight, Mail } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MotionButton>Default</MotionButton>
      <MotionButton variant="secondary">Secondary</MotionButton>
      <MotionButton variant="outline" icon={<Mail />}>
        Email
      </MotionButton>
      <MotionButton variant="ghost" secondIcon={<ArrowRight />}>
        Next
      </MotionButton>
      <MotionButton variant="destructive" size="sm">
        Delete
      </MotionButton>
      <MotionButton loading>Loading</MotionButton>
    </div>
  )
}
