import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button10Demo() {
  return (
    <>
      <Button
        loading={true}
        icon={{
          children: Inbox,
        }}
      >
        Button
      </Button>
    </>
  )
}
