'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ButtonGroup } from '@gentleduck/registry-ui-duckui/button-group'
import { Input } from '@gentleduck/registry-ui-duckui/input'

import { SearchIcon } from 'lucide-react'
import * as React from 'react'

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button aria-label="Search" variant="outline">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
