import React from 'react'
import { Button } from '@duck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'

export default function Button16Demo() {
  return (
    <>
      <Button
        aria-label="Open inbox and trigger command"
        type="button"
        role="button"
        icon={<Inbox />}
        label={{
          showCommand: true,
          showLabel: true,
        }}
        command={{
          key: 'alt+l',
          label: 'alt+l',
          action: () =>
            toast('Your inbox has been updated', {
              description: `you have clicked the 'command label' button`,
            }),
        }}
      >
        Button
      </Button>
    </>
  )
}
