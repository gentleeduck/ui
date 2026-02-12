'use client'

import { type Event, trackEvent } from '@duck-docs/lib/events'
import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { CheckIcon, ClipboardIcon, Copy } from 'lucide-react'
import * as React from 'react'
import type { CopyButtonProps, CopyWithClassNamesProps } from './copy-button.types'

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  navigator.clipboard.writeText(value)
  if (event) {
    trackEvent(event)
  }
}

export function CopyButton({ value, className, variant = 'ghost', event, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 3000)
  }, [hasCopied])

  return (
    <Button
      aria-label="Copy"
      className={cn('[&_svg]:!size-3.5 z-50 size-7 rounded-sm shadow-none', className)}
      icon={hasCopied ? <CheckIcon /> : <Copy />}
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

export function CopyWithClassNames({ value, classNames, className }: CopyWithClassNamesProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyToClipboard = React.useCallback((value: string) => {
    copyToClipboardWithMeta(value)
    setHasCopied(true)
  }, [])

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger asChild>
        <Button
          className={cn('!size-6.5 relative z-50 [&_svg]:w-3.5', className)}
          icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          size="icon"
          variant="outline"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copyToClipboard(value)}>Component</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard(classNames)}>Classname</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
