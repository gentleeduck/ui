import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function Button23Demo() {
  return (
    <div className='block'>
      <Button
        aria-label='Inbox button'
        type='button'
        role='button'
        variant='link_hover1'
        icon={<Inbox />}
      >
        Button
      </Button>
    </div>
  )
}
