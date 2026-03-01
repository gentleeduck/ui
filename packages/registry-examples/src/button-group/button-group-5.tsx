'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@gentleduck/registry-ui/button-group'
import * as React from 'react'

export default function ButtonGroupSeparatorDemo() {
  return (
    <ButtonGroup>
      <Button size="sm" variant="secondary">
        Copy
      </Button>
      <ButtonGroupSeparator />

      <Button size="sm" variant="secondary">
        Paste
      </Button>
    </ButtonGroup>
  )
}
