'use client'

import { MotionInput } from '@gentleduck/registry-ui/input'
import { MotionLabel } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-label-name" index={0}>
          Full name
        </MotionLabel>
        <MotionInput id="motion-label-name" placeholder="Jane Doe" index={0} />
      </div>
      <div className="flex flex-col gap-1.5">
        <MotionLabel htmlFor="motion-label-email" index={1}>
          Email address
        </MotionLabel>
        <MotionInput id="motion-label-email" type="email" placeholder="jane@example.com" index={1} />
      </div>
    </div>
  )
}
