'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@gentleduck/registry-ui-duckui/button-group'
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
