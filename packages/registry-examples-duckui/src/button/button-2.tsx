import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'

export default function ButtonSimpleDemo() {
  return (
    <Button
      aria-label='Simple button'
      variant={'default'}
      type='button'
      role='button'
    >
      Button
    </Button>
  )
}
