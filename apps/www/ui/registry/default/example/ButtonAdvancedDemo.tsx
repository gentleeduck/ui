import React from 'react'
import { Inbox } from 'lucide-react'
import { Button, TooltipProvider } from '@/registry/default/ui'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { buttonVarieties } from '@/hooks/use-varieties'

export default function ButtonAdvancedDemo() {
  //NOTE: that's a state in the example
  const [variety] = useAtom(buttonVarieties)
  //NOTE: you will use your own variables not this state in the example
  const { size, open, label, variant, title, commandLabel, command, loading } = variety.default.variety!

  return (
    <>
      <TooltipProvider>
        <Button
          isCollapsed={open}
          icon={{
            icon: Inbox,
          }}
          title={title}
          variant={variant}
          size={size}
          role="button"
          aria-label={title || 'Inbox'}
          aria-disabled={false}
          aria-expanded={open}
          aria-pressed={open}
          tabIndex={0}
          loading={loading}
          label={{
            children: label,
            showCommand: true,
          }}
          command={{
            label: commandLabel as string,
            key: command as string,
            action: () =>
              toast('Your inbox has been updated', {
                description: `Your inbox has ${label} messages`,
              }),
          }}
          delayDuration={0}
        />
      </TooltipProvider>
    </>
  )
}
