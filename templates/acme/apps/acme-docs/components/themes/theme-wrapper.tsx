'use client'

import { useConfig } from '@gentleduck/docs/client'
import { cn } from '@gentleduck/libs/cn'

interface IThemeWrapperProps extends React.ComponentProps<'div'> {
  defaultTheme?: string
}

export function ThemeWrapper({ defaultTheme, children, className }: IThemeWrapperProps) {
  const [config] = useConfig()

  return (
    <div
      className={cn(`theme-${defaultTheme || config.theme}`, 'w-full', className)}
      style={
        {
          '--radius': `${defaultTheme ? 0.5 : config.radius}rem`,
        } as React.CSSProperties
      }>
      {children}
    </div>
  )
}
