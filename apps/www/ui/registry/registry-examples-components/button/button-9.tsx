import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'
import { Inbox } from 'lucide-react'

export default function Button9Demo() {
  return (
    <>
      <Button
        icon={{ children: Inbox }}
        aria-label="Inbox button"
        type="button"
        role="button"
      >
        Button
      </Button>
    </>
  )
}
