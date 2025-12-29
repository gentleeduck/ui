'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button, ButtonProps } from '@gentleduck/registry-ui-duckui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui-duckui/tooltip'
import { CheckIcon, ClipboardIcon, Copy } from 'lucide-react'
import * as React from 'react'
import { Event, trackEvent } from '~/lib/events'

export function BlockCopyButton({
  event,
  name,
  code,
  className,
  ...props
}: {
  event: Event['name']
  name: string
  code: string
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('[&_svg]:!size-3.5 h-7 w-7 rounded-[6px] [&_svg]:w-3.5 flex place-content-center', className)}
          onClick={() => {
            navigator.clipboard.writeText(code)
            trackEvent({
              name: event,
              properties: {
                name,
              },
            })
            setHasCopied(true)
          }}
          size="icon"
          variant="outline"
          {...props}>
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">Copy code</TooltipContent>
    </Tooltip>
  )
}
