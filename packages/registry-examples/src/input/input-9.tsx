'use client'

import { MotionInput } from '@gentleduck/registry-ui/input'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <MotionInput id="motion-name" placeholder="Jane Doe" index={0} />
    </div>
  )
}
