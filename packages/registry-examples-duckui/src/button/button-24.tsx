import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function Button24Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Inbox button"
        type="button"
        role="button"
        variant="link_hover2"
        icon={<Inbox />}
      >
        Button
      </Button>
    </div>
  )
}
