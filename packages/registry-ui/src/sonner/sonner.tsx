'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Direction, useDirection } from '@gentleduck/primitives/direction'
import { useTheme } from 'next-themes'
import type * as React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ dir, className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const direction = useDirection(dir as Direction)

  return (
    <Sonner
      className={cn('toaster group [&_li>div]:w-full', className)}
      dir={direction}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-border': 'var(--border)',
          '--normal-text': 'var(--popover-foreground)',
        } as React.CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      {...props}
    />
  )
}
Toaster.displayName = 'Toaster'

export { Toaster }
