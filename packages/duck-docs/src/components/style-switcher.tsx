'use client'

import { useConfig } from '@duck-docs/hooks/use-config'
import { type Style, styles } from '@duck-docs/lib/registry-styles'
import { cn } from '@gentleduck/libs/cn'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import type * as React from 'react'

export function StyleSwitcher({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectTrigger>) {
  const [config, setConfig] = useConfig()

  return (
    <Select
      onValueChange={
        ((value: Style['name']) =>
          setConfig({
            ...config,
            style: value,
          })) as never
      }
      value={config.style}>
      <SelectTrigger className={cn('h-7 w-[145px] text-xs [&_svg]:h-4 [&_svg]:w-4', className)} {...props}>
        <span className="text-muted-foreground">Style: </span>
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent>
        {styles.map((style) => (
          <SelectItem className="text-xs" key={style.name} value={style.name}>
            {style.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
