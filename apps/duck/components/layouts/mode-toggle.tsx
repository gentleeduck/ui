'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import { siteConfig } from '~/config/site'
import { useMetaColor } from '~/hooks'

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()
  const metaThemeColors = siteConfig.metaThemeColors
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    setMetaColor(resolvedTheme === 'dark' ? metaThemeColors.light : metaThemeColors.dark)
  }, [resolvedTheme, setTheme, setMetaColor])

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
