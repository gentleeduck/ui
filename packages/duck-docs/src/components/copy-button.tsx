'use client'

import { type Event, trackEvent } from '@duck-docs/lib/events'
import { cn } from '@gentleduck/libs/cn'
import { Button, type ButtonProps } from '@gentleduck/registry-ui/button'
import { CheckIcon, Copy } from 'lucide-react'
import * as React from 'react'

const COPY_RESET_MS = 3000

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    // Clipboard may be unavailable (insecure context, permission denied);
    // silently drop — the trackEvent below should still fire on best effort.
  }
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
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Button
      aria-label={hasCopied ? 'Copied' : 'Copy'}
      className={cn('size-7 rounded-sm shadow-none [&_svg]:size-3.5!', className)}
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
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setHasCopied(false), COPY_RESET_MS)
      }}
      size="icon"
      variant={variant}
      {...props}
    />
  )
}
