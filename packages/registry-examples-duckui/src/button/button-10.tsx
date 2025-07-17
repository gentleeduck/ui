import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'
import React from 'react'

export default function Button10Demo() {
  return (
    <>
      <Button
        loading={true}
        icon={<Inbox />}
        aria-label="Loading inbox button"
        aria-busy="true"
        type="button"
        role="button">
        <span>Button</span>
      </Button>
    </>
  )
}
