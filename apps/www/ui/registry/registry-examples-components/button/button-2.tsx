import React from 'react'
import { TooltipProvider } from '@/registry/default/ui'
import { Button } from '@/registry'
import { Inbox } from 'lucide-react'

export default function ButtonSimpleDemo() {
  return (
    <>
      <TooltipProvider>
        <Button
          is_collapsed={false}
          icon={{
            children: Inbox,
          }}
          title={'Click me'}
          variant={'default'}
          size={'sm'}
          loading={false}
          label={{
            children: 'Click me',
          }}
        />
      </TooltipProvider>
    </>
  )
}
