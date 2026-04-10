'use client'

import { MotionInput } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motion-name">Name</Label>
        <MotionInput id="motion-name" placeholder="Jane Doe" index={0} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motion-email">Email</Label>
        <MotionInput id="motion-email" type="email" placeholder="jane@example.com" index={1} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="motion-password">Password</Label>
        <MotionInput id="motion-password" type="password" placeholder="Enter password" index={2} />
      </div>
    </div>
  )
}
