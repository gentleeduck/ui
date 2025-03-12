import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { ArrowRight, Inbox } from 'lucide-react'

export default function Button18Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Expand inbox button"
        type="button"
        role="button"
        variant="expand_icon"
        animationIcon={{
          icon: <ArrowRight />,
          iconPlacement: 'right',
        }}
        icon={<Inbox />}
      >
        Button
      </Button>
    </div>
  )
}
