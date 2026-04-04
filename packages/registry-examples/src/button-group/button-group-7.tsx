'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { ButtonGroup } from '@gentleduck/registry-ui/button-group'
import { Input } from '@gentleduck/registry-ui/input'

import { SearchIcon } from 'lucide-react'

export default function Demo() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button aria-label="Search" variant="outline">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
