'use client'

import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { TooltipProvider } from '@gentleduck/registry-ui-duckui/tooltip'
import { KeyProvider } from '@gentleduck/vim/react'
import type { ReactNode } from 'react'

export function AppClientProviders({ children }: { children: ReactNode }) {
  return (
    <KeyProvider timeoutMs={100}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </KeyProvider>
  )
}
