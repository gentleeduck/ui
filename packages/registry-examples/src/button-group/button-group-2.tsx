'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { MinusIcon, PlusIcon } from 'lucide-react'

export default function Demo() {
  return (
    <ButtonGroup aria-label="Media controls" className="h-fit" orientation="vertical">
      <Button aria-label="Increase" size="icon" variant="outline">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button aria-label="Decrease" size="icon" variant="outline">
        <MinusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}
