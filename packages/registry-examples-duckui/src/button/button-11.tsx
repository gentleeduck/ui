import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ChevronsRight } from 'lucide-react'

export default function Button11Demo() {
  return (
    <>
      <Button
        aria-label="Inbox button with 23 notifications"
        type="button"
        role="button"
        secondIcon={<ChevronsRight />}>
        Button
      </Button>
    </>
  )
}
