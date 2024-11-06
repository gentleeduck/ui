import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { ArrowRight, Inbox } from 'lucide-react'

export default function Button18Demo() {
  return (
    <div className="block">
      <Button
        variant="expand_icon"
        animationIcon={{
          icon: {
            children: ArrowRight,
          },
          iconPlacement: 'right',
        }}
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </div>
  )
}
