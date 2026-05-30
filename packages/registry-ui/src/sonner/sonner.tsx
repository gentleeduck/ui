'use client'

import { cn } from '@gentleduck/libs/cn'
import { useDirection } from '@gentleduck/primitives/direction'
import { useTheme } from 'next-themes'
import React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { toDirection } from '../direction/direction.libs'

const Toaster = React.forwardRef<React.ComponentRef<typeof Sonner>, ToasterProps>(
  ({ dir, className, ...props }, ref) => {
    const { theme = 'system' } = useTheme()
    const direction = useDirection(toDirection(dir))

    return (
      <Sonner
        ref={ref}
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
  },
)
Toaster.displayName = 'Toaster'

export { Toaster }
