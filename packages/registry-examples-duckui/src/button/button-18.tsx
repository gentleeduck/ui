import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Inbox } from 'lucide-react'
import React from 'react'

export default function Button17Demo() {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <Button
      aria-label="Inbox button with 23 notifications"
      type="button"
      isCollapsed={open}
      icon={<Inbox />}
      onClick={() => setOpen(!open)}>
      Button
    </Button>
  )
}
