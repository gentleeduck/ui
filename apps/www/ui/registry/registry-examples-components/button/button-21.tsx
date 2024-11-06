import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button21Demo() {
  return (
    <div className="block">
      <Button
        variant="gooey_right"
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </div>
  )
}
