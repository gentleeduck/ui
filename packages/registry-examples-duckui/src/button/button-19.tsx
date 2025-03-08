import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { Apple, ArrowLeft } from 'lucide-react'

export default function Button19Demo() {
  return (
    <div className="block">
      <Button
        aria-label="Expand inbox button"
        type="button"
        role="button"
        variant="expand_icon"
        animationIcon={{
          icon: { children: ArrowLeft },
          iconPlacement: 'left',
        }}
        secondIcon={{ children: Apple }}
      >
        Button
      </Button>
    </div>
  )
}
