'use client'

import { useSiteConfig } from '@duck-docs/context'
import { useMetaColor } from '@duck-docs/hooks/use-meta-colors'
import { Button } from '@gentleduck/registry-ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

const DEFAULT_META_THEME_COLORS = {
  dark: '#000000',
  light: '#ffffff',
}

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()
  const siteConfig = useSiteConfig()
  const metaThemeColors = siteConfig.metaThemeColors ?? DEFAULT_META_THEME_COLORS
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    setMetaColor(resolvedTheme === 'dark' ? metaThemeColors.light : metaThemeColors.dark)
  }, [resolvedTheme, setTheme, setMetaColor, metaThemeColors.dark, metaThemeColors.light])

  return (
    <Button
      aria-label={mounted ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme` : 'Toggle theme'}
      className="group/toggle"
      icon={
        <>
          <SunIcon aria-hidden="true" className="hidden [html.dark_&]:block" />
          <MoonIcon aria-hidden="true" className="hidden [html.light_&]:block" />
        </>
      }
      onClick={toggleTheme}
      size={'icon'}
      variant="ghost"
    />
  )
}
