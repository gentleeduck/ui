import { useSiteConfig } from '@duck-docs/context'
import { useTheme } from 'next-themes'
import * as React from 'react'

const DEFAULT_META_THEME_COLORS = {
  dark: '#000000',
  light: '#ffffff',
}

export function useMetaColor() {
  const { resolvedTheme } = useTheme()
  const siteConfig = useSiteConfig()
  const metaThemeColors = siteConfig.metaThemeColors ?? DEFAULT_META_THEME_COLORS

  const metaColor = React.useMemo(() => {
    return resolvedTheme !== 'dark' ? metaThemeColors.light : metaThemeColors.dark
  }, [metaThemeColors.dark, metaThemeColors.light, resolvedTheme])

  const setMetaColor = React.useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [])

  return {
    metaColor,
    setMetaColor,
  }
}
