'use client'

import { type Event, trackEvent } from '@gentleduck/docs/lib'
import { cn } from '@gentleduck/libs/cn'
import { Button, type ButtonProps } from '@gentleduck/registry-ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@gentleduck/registry-ui/tooltip'
import { CheckIcon, Copy } from 'lucide-react'
import * as React from 'react'

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
  }, [])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('[&_svg]:!size-3.5 flex h-7 w-7 place-content-center rounded-[6px] [&_svg]:w-3.5', className)}
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
          {hasCopied ? <CheckIcon aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">Copy code</TooltipContent>
    </Tooltip>
  )
}
