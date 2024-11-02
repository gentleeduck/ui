import React from 'react'
import { TooltipProvider } from '@/registry/default/ui'
import { Button } from '@/registry/registry-ui-components'
import { Inbox } from 'lucide-react'

export default function ButtonSimpleDemo() {
  return (
    <>
      <TooltipProvider>
        <Button
          icon={{
            children: Inbox,
          }}
          label={{
            showLabel: true,
            children: 'Normal Button',
          }}
        >
          Button
        </Button>
      </TooltipProvider>
    </>
  )
}
