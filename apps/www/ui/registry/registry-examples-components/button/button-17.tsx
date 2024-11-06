import React from 'react'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'

export default function Button17Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <>
      <Button
        isCollapsed={open}
        icon={{
          children: Inbox,
        }}
        onClick={() => setOpen(!open)}
      >
        Button
      </Button>
    </>
  )
}
