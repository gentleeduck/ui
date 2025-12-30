'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { useSiteConfig } from '../context/docs-context'
import { useMetaColor } from '../hooks/use-meta-colors'

const DEFAULT_META_THEME_COLORS = {
  dark: '#000000',
  light: '#ffffff',
}

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()
  const siteConfig = useSiteConfig()
  const metaThemeColors = siteConfig.metaThemeColors ?? DEFAULT_META_THEME_COLORS

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    setMetaColor(resolvedTheme === 'dark' ? metaThemeColors.light : metaThemeColors.dark)
  }, [resolvedTheme, setTheme, setMetaColor])

  return (
    <Button
      aria-label="toggle theme"
      className="group/toggle"
      icon={
        <>
          <SunIcon className="hidden [html.dark_&]:block" />
          <MoonIcon className="hidden [html.light_&]:block" />
        </>
      }
      onClick={toggleTheme}
      size={'icon'}
      variant="ghost"
    />
  )
}
