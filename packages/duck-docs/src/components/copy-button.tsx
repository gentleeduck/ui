'use client'

import { type Event, trackEvent } from '@duck-docs/lib/events'
import { cn } from '@gentleduck/libs/cn'
import { Button, type ButtonProps } from '@gentleduck/registry-ui/button'
import { CheckIcon, Copy } from 'lucide-react'
import * as React from 'react'

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  navigator.clipboard.writeText(value)
  if (event) {
    trackEvent(event)
  }
}

export type ICopyButtonProps = ButtonProps & {
  value: string
  event?: Event['name']
}

export function CopyButton({ value, className, variant = 'ghost', event, ...props }: ICopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 3000)
  }, [])

  return (
    <Button
      aria-label={hasCopied ? 'Copied' : 'Copy'}
      className={cn('[&_svg]:!size-3.5 size-7 rounded-sm shadow-none', className)}
      icon={hasCopied ? <CheckIcon aria-hidden="true" /> : <Copy aria-hidden="true" />}
      onClick={() => {
        copyToClipboardWithMeta(
          value,
          event
            ? {
                name: event,
                properties: {
                  code: value,
                },
              }
            : undefined,
        )
        setHasCopied(true)
      }}
      size="icon"
      variant={variant}
      {...props}
    />
  )
}
