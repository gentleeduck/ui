import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { ChevronsRight, Inbox } from 'lucide-react'

export default function Button11Demo() {
  return (
    <>
      <Button
        icon={{
          children: Inbox,
        }}
        secondIcon={{
          children: ChevronsRight,
        }}
      >
        Button
      </Button>
    </>
  )
}
