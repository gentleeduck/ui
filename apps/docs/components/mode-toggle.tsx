'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { META_THEME_COLORS } from '~/config/site'
import { useMetaColor } from '~/hooks/use-meta-colors'

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor } = useMetaColor()

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    setMetaColor(resolvedTheme === 'dark' ? META_THEME_COLORS.light : META_THEME_COLORS.dark)
  }, [resolvedTheme, setTheme, setMetaColor])

  return (
    <Button
      variant="ghost"
      className="group/toggle"
      onClick={toggleTheme}
      aria-label="toggle theme"
      icon={
        <>
          <SunIcon className="hidden [html.dark_&]:block" />
          <MoonIcon className="hidden [html.light_&]:block" />
        </>
      }
      size={'icon'}></Button>
  )
}
