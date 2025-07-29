'use client'

import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'

export default function RadioGroupDemo() {
  return (
    <RadioGroup className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0">
      <RadioGroupItem value="default">Default</RadioGroupItem>
      <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
      <RadioGroupItem value="compact">Compact</RadioGroupItem>
    </RadioGroup>
  )
}
