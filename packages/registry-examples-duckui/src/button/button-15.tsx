import React from 'react'
import { Button } from '@gentelduck/registry-ui-duckui/button'
import { toast } from 'sonner'

export default function Button15Demo() {
  return (
    <>
      <Button
        aria-label='Inbox button with keyboard shortcut'
        type='button'
        role='button'
        command={{
          key: 'alt+k',
          children: 'alt+k',
          action: () =>
            toast('Your inbox has been updated', {
              description: `you have clicked the 'command' button`,
            }),
        }}
      >
        Button
      </Button>
    </>
  )
}
