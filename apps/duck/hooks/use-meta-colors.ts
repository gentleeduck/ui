import { useTheme } from 'next-themes'
import * as React from 'react'
import { siteConfig } from '~/config/site'

export function useMetaColor() {
  const { resolvedTheme } = useTheme()
  const metaThemeColors = siteConfig.metaThemeColors

  const metaColor = React.useMemo(() => {
    return resolvedTheme !== 'dark' ? metaThemeColors.light : metaThemeColors.dark
  }, [resolvedTheme])

  const setMetaColor = React.useCallback((color: string) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [])

  return {
    metaColor,
    setMetaColor,
  }
}
