import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button24Demo() {
  return (
    <div className="block">
      <Button
        variant="link_hover2"
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </div>
  )
}
