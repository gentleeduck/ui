import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'
import { Inbox } from 'lucide-react'

export default function Button10Demo() {
  return (
    <>
      <Button
        loading={true}
        icon={{ children: Inbox }}
        aria-label="Loading inbox button"
        aria-busy="true"
        type="button"
        role="button"
      >
        <span>Button</span>
      </Button>
    </>
  )
}
