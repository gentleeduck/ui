import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'

// NOTE: this component is not used in the documentation
export default function Button26Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Inbox button"
        type="button"
        role="button"
        variant="secondary"
      >
        Button
      </Button>
    </div>
  )
}
