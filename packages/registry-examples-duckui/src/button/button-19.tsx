import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ArrowLeft } from 'lucide-react'

export default function Button19Demo() {
  return (
    <div className='block'>
      <Button
        aria-label='Expand inbox button'
        type='button'
        role='button'
        variant='expand_icon'
        animationIcon={{
          icon: <ArrowLeft />,
          iconPlacement: 'left',
        }}
      >
        Button
      </Button>
    </div>
  )
}
