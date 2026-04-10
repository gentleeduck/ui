'use client'

import { Field, FieldDescription, FieldTitle } from '@gentleduck/registry-ui/field'
import { Slider } from '@gentleduck/registry-ui/slider'
import { useState } from 'react'

export default function Demo() {
  const [value, setValue] = useState([200, 800])
  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($
          <span className="font-medium tabular-nums">{value[0]}</span> -{' '}
          <span className="font-medium tabular-nums">{value[1]}</span>).
        </FieldDescription>
        <Slider
          aria-label="Price Range"
          className="mt-2 w-full"
          max={1000}
          min={0}
          onValueChange={setValue}
          step={10}
          value={value}
        />
      </Field>
    </div>
  )
}
