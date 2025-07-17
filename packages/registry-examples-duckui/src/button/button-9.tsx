import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'
import React from 'react'

export default function Button9Demo() {
  return (
    <>
      <Button icon={<Inbox />} aria-label="Inbox button" type="button" role="button">
        Button
      </Button>
    </>
  )
}
