import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { ChevronsRight, Inbox } from 'lucide-react'

export default function Button11Demo() {
  return (
    <>
      <Button
        aria-label="Inbox button with 23 notifications"
        type="button"
        role="button"
        icon={<Inbox />}
        secondIcon={<ChevronsRight />}
      >
        Button
      </Button>
    </>
  )
}
