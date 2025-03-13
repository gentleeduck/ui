import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'

export default function Button26Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Inbox button"
        type="button"
        role="button"
        variant="secondary"
        border="secondary"
      >
        Button
      </Button>
    </div>
  )
}
