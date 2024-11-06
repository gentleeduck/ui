import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button14Demo() {
  return (
    <>
      <Button
        icon={{
          children: Inbox,
        }}
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
