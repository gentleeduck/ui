'use client'

import { CheckIcon, ClipboardIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Event, trackEvent } from '~/lib/events'
import { cn } from '@gentleduck/libs/cn'
import { CopyButtonProps, CopyNpmCommandButtonProps, CopyWithClassNamesProps } from './copy-button.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gentleduck/registry-ui-duckui/tabs'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'

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
      className={cn('w-6.5 h-6.5 [&_svg]:h-3.5 [&_svg]:w-3.5 shadow-none rounded-sm', className)}
      icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn('relative z-10 [&_svg]:w-3.5 !size-6.5', className)}
          icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          {...props}></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
