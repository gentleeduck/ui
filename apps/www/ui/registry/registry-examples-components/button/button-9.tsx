import React from 'react'
import { TooltipProvider } from '@/registry/default/ui'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function Button9Demo() {
  return (
    <>
      <TooltipProvider>
        <Button
          icon={{
            children: Inbox,
          }}
        >
          Button
        </Button>
      </TooltipProvider>
    </>
  )
}
