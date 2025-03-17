import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'

export default function Button12Demo() {
  return (
    <>
      <Button
        aria-label='Inbox button with 23 notifications'
        type='button'
        role='button'
        label={{
          children: '23',
        }}
      >
        Button
      </Button>
    </>
  )
}
