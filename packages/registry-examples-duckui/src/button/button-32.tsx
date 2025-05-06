import React from 'react'
import { Button } from '@gentleduck/registry-ui-duckui/button'

export default function Button32Demo() {
  return (
    <div className='block'>
      <Button
        aria-label='Inbox button'
        type='button'
        role='button'
        variant='secondary'
        border='secondary'
      >
        Button
      </Button>
    </div>
  )
}
