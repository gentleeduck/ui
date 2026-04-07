'use client'

import { KbdGroup, MotionKbd } from '@gentleduck/registry-ui/kbd'

export default function Demo() {
  return (
    <div className="flex items-center gap-4 p-4">
      <KbdGroup>
        <MotionKbd index={0}>⌘</MotionKbd>
        <MotionKbd index={1}>K</MotionKbd>
      </KbdGroup>
      <KbdGroup>
        <MotionKbd index={2}>⌘</MotionKbd>
        <MotionKbd index={3}>⇧</MotionKbd>
        <MotionKbd index={4}>P</MotionKbd>
      </KbdGroup>
    </div>
  )
}
