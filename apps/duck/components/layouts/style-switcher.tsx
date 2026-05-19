'use client'

import { cn } from '@gentleduck/libs/cn'
import { type Style, styles } from '@gentleduck/registers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import type * as React from 'react'
import { useConfig } from '~/hooks'

// Local button-like contract avoids brittle declaration inference across package boundaries.
export interface IStyleSwitcherProps extends React.ComponentPropsWithoutRef<'button'> {}

export function StyleSwitcher({ className, ...props }: IStyleSwitcherProps) {
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
      <SelectTrigger
        aria-label="Style"
        className={cn('h-7 w-36.25 text-xs [&_svg]:h-4 [&_svg]:w-4', className)}
        {...props}>
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
