'use client'
import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { useState } from 'react'

export default function Demo() {
  const [checked, setChecked] = useState<'indeterminate' | boolean>('indeterminate')

  return <Checkbox checked={checked} onCheckedChange={setChecked} />
}
