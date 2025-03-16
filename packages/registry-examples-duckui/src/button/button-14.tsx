import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'

export default function Button14Demo() {
  return (
    <>
      <Button
        aria-label='Inbox button with 23 notifications'
        type='button'
        role='button'
        icon={<Inbox />}
        label={{
          showLabel: true,
          variant: 'nothing',
          children: '23',
          side: 'right',
        }}
      >
        Button
      </Button>
    </>
  )
}
