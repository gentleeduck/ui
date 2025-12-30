'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Style, styles } from '@gentleduck/registers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import type * as React from 'react'
import { useConfig } from '../../hooks/use-config'

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
