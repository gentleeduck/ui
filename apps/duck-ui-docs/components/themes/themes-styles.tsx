'use client'

import { useThemesConfig } from '@gentleduck/docs/client'

export function ThemesStyle() {
  const { themesConfig } = useThemesConfig()

  if (!themesConfig.activeTheme) {
    return null
  }

  return (
    <style>
      {`
.themes-wrapper,
[data-chart] {
  ${Object.entries(themesConfig.activeTheme.cssVars.light)
    .map(([key, value]) => `${key}: hsl(${value});`)
    .join('\n')}
}

.dark .themes-wrapper,
.dark [data-chart] {
  ${Object.entries(themesConfig.activeTheme.cssVars.dark)
    .map(([key, value]) => `${key}: hsl(${value});`)
    .join('\n')}
}
  `}
    </style>
  )
}
