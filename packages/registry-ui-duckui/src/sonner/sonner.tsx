'use client'

import { useTheme } from 'next-themes'
import type * as React from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      className="toaster group [&_li>div]:w-full"
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
