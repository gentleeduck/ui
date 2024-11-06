import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button20Demo() {
  return (
    <div className="block">
      <Button
        variant="ring_hover"
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </div>
  )
}
