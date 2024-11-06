import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button23Demo() {
  return (
    <div className="block">
      <Button
        variant="link_hover1"
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </div>
  )
}
