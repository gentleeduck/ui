'use client'

import * as React from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <JotaiProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </JotaiProvider>
  )
}
