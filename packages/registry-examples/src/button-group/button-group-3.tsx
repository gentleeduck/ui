'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { PlusIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex flex-col items-start gap-8">
      <ButtonGroup>
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Button size="sm" variant="outline">
          Group
        </Button>
        <Button aria-label="Add" size="icon-sm" variant="outline">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button aria-label="Add" size="icon" variant="outline">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button size="lg" variant="outline">
          Large
        </Button>
        <Button size="lg" variant="outline">
          Button
        </Button>
        <Button size="lg" variant="outline">
          Group
        </Button>
        <Button aria-label="Add" size="icon-lg" variant="outline">
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  )
}
