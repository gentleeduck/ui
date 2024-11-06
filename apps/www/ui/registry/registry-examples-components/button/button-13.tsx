import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button13Demo() {
  return (
    <>
      <Button
        icon={{
          children: Inbox,
        }}
        label={{
          variant: 'nothing',
          children: '23',
        }}
      >
        Button
      </Button>
    </>
  )
}
