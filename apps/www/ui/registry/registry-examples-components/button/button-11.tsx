import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'
import { ChevronsRight, Inbox } from 'lucide-react'

export default function Button11Demo() {
  return (
    <>
      <Button
        aria-label="Inbox button with 23 notifications"
        type="button"
        role="button"
        icon={{ children: Inbox }}
        secondIcon={{
          children: ChevronsRight,
        }}
      >
        Button
      </Button>
    </>
  )
}
