'use client'
import { Checkbox, type CheckedState } from '@gentleduck/registry-ui/checkbox'
import { useState } from 'react'

export default function Example() {
  const [checked, setChecked] = useState<CheckedState>(false)

  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}
