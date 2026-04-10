'use client'

import { MotionSkeleton } from '@gentleduck/registry-ui/skeleton'

export default function Demo() {
  return (
    <div className="flex items-center space-x-4">
      <MotionSkeleton className="h-12 w-12 rounded-full" index={0} />
      <div className="space-y-2">
        <MotionSkeleton className="h-4 w-[250px]" index={1} />
        <MotionSkeleton className="h-4 w-[200px]" index={2} />
      </div>
    </div>
  )
}
