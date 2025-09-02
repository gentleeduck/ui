'use client'

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
import { Event, trackEvent } from '~/lib/events'
import { CopyButtonProps, CopyNpmCommandButtonProps, CopyWithClassNamesProps } from './copy-button.types'

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
      size="icon"
      variant={variant}
      aria-label="Copy"
      className={cn('w-6.5 h-6.5 [&_svg]:h-3.5 [&_svg]:w-3.5 shadow-none rounded-sm z-50', className)}
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
      {...props}
    />
  )
}

export function CopyWithClassNames({ value, classNames, className, ...props }: CopyWithClassNamesProps) {
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
          size="icon"
          variant="outline"
          className={cn('relative z-50 [&_svg]:w-3.5 !size-6.5', className)}
          icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          {...props}></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copyToClipboard(value)}>Component</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard(classNames)}>Classname</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CopyNpmCommandButton({ commands, className, ...props }: CopyNpmCommandButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyCommand = React.useCallback((value: string, pm: 'npm' | 'pnpm' | 'yarn' | 'bun') => {
    copyToClipboardWithMeta(value, {
      name: 'copy_npm_command',
      properties: {
        command: value,
        pm,
      },
    })
    setHasCopied(true)
  }, [])

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn('relative z-10 [&_svg]:w-3.5 !size-6.5', className)}
      icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}
      {...props}></Button>
  )
}
