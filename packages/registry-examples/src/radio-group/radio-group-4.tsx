'use client'

import { MotionRadioGroup, MotionRadioGroupItem } from '@gentleduck/registry-ui/radio-group'

export default function Demo() {
  return (
    <MotionRadioGroup
      className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0"
      defaultValue="comfortable">
      <MotionRadioGroupItem value="default">Default</MotionRadioGroupItem>
      <MotionRadioGroupItem value="comfortable">Comfortable</MotionRadioGroupItem>
      <MotionRadioGroupItem value="compact">Compact</MotionRadioGroupItem>
    </MotionRadioGroup>
  )
}
