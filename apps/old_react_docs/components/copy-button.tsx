'use client'

import { CheckIcon, ClipboardIcon } from 'lucide-react'
import * as React from 'react'
import { NpmCommands } from 'types/unist'

import { Button, ButtonProps } from '@gentleduck/registry-ui-duckui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Event, trackEvent } from '~/lib/events'
import { cn } from '@gentleduck/libs/cn'

interface CopyButtonProps extends ButtonProps {
  value: string
  src?: string
  event?: Event['name']
}

export async function copyToClipboardWithMeta(value: string, event?: Event) {
  navigator.clipboard.writeText(value)
  if (event) {
    trackEvent(event)
  }
}

export function CopyButton({ value, className, src, variant = 'ghost', event, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn('relative z-10 h-6 w-6  [&_svg]:h-3 [&_svg]:w-3', className)}
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
      {...props}>
      <span className="sr-only">Copy</span>
    </Button>
  )
}

interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  value: string
  classNames: string
  className?: string
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
          className={cn('relative z-10 h-6 w-6  [&_svg]:h-3 [&_svg]:w-3', className)}
          icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}>
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => copyToClipboard(value)}>Component</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard(classNames)}>Classname</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
  commands: Required<NpmCommands>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn('relative z-10 h-6 w-6  [&_svg]:h-3 [&_svg]:w-3', className)}
          icon={hasCopied ? <CheckIcon /> : <ClipboardIcon />}>
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => copyCommand(commands.__npmCommand__, 'npm')}>npm</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__yarnCommand__, 'yarn')}>yarn</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__pnpmCommand__, 'pnpm')}>pnpm</DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__bunCommand__, 'bun')}>bun</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
