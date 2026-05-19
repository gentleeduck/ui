'use client'

import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui/radio-group'

export default function Demo() {
  return (
    <RadioGroup
      dir="rtl"
      className="[&>div]:felx flex flex-col space-y-1 [&>div]:items-center [&>div]:space-x-3 [&>div]:space-y-0"
      defaultValue="comfortable">
      <RadioGroupItem value="default">افتراضي</RadioGroupItem>
      <RadioGroupItem value="comfortable">مريح</RadioGroupItem>
      <RadioGroupItem value="compact">مضغوط</RadioGroupItem>
    </RadioGroup>
  )
}
