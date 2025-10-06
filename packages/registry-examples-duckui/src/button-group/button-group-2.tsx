'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup } from '@gentleduck/registry-ui-duckui/button-group'
import { MinusIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup aria-label="Media controls" className="h-fit" orientation="vertical">
      <Button size="icon" variant="outline">
        <PlusIcon />
      </Button>
      <Button size="icon" variant="outline">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  )
}
