'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'

export default function Demo() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    const color = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(color)
  }, [resolvedTheme, setTheme])

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
