import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'

export default function Button14Demo() {
  return (
    <>
      <Button
        aria-label='Inbox button with 23 notifications'
        type='button'
        role='button'
        label={{
          className: 'font-mono',
          showLabel: true,
          variant: 'nothing',
          children: 'Inbox has 23 message',
          side: 'top',
        }}
      >
        Button
      </Button>
    </>
  )
}
