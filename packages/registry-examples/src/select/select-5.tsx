'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'

export default function Demo() {
  return (
    <Select>
      <SelectTrigger className="w-48 data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  )
}
