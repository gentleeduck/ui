'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@gentleduck/registry-ui-duckui/button-group'
import { Plus } from 'lucide-react'
import * as React from 'react'

export function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <Plus />
      </Button>
    </ButtonGroup>
  )
}
