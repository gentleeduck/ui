import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'

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
