import React from 'react'
import { Inbox } from 'lucide-react'
import { Button, TooltipProvider } from '@/registry/default/ui'
import { buttonVarieties } from '@/hooks/use-varieties'
import { useAtom } from 'jotai'

export default function ButtonMainDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { size, open, label, variant, title, loading } = variety.default.variety!

  return (
    <>
      <TooltipProvider>
        <Button
          isCollapsed={open}
          icon={{
            children: Inbox,
          }}
          title={title}
          variant={variant}
          size={size}
          loading={loading}
          label={{
            children: label,
          }}
        />
      </TooltipProvider>
    </>
  )
}
