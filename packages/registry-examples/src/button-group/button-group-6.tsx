'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@gentleduck/registry-ui/button-group'
import { Plus } from 'lucide-react'

export default function Demo() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button aria-label="Add" size="icon" variant="secondary">
        <Plus aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}
