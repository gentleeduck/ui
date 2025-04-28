import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { ArrowRight } from 'lucide-react'

export default function Button18Demo() {
  return (
    <div className='block'>
      <Button
        aria-label='Expand inbox button'
        type='button'
        role='button'
        variant='expand_icon'
        animationIcon={{
          icon: <ArrowRight />,
          iconPlacement: 'right',
        }}
      >
        Button
      </Button>
    </div>
  )
}
