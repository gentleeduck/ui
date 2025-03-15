import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { Apple, ArrowLeft, Inbox } from 'lucide-react'

export default function Button19Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Expand inbox button"
        type="button"
        role="button"
        variant="expand_icon"
        animationIcon={{
          icon: <ArrowLeft />,
          iconPlacement: 'left',
        }}
        secondIcon={<Inbox />}
      >
        Button
      </Button>
    </div>
  )
}
