import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'

export default function Button31Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Inbox button"
        type="button"
        role="button"
        variant="warning"
        border="warning"
      >
        Button
      </Button>
    </div>
  )
}
